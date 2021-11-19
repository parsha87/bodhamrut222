import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import {
    FileTransfer,
    FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { MusicControls } from '@ionic-native/music-controls/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { LoadingController, Platform, ToastController } from '@ionic/angular';
import { MyData } from '../musicuplod/musicupload.model';
import { File } from '@ionic-native/file/ngx';

@Injectable()
export class AudioProvider {

    title = 'भक्तराज भोधामृत';
    filename = 'I_Have_a_Dream.mp3';
    lyrics: string = '';
    curr_playing_file: MediaObject = null;
    storageDirectory: any;
    bhajansData: MyData = new MyData();
    is_playing: boolean = false;
    is_in_play: boolean = false;
    is_ready: boolean = false;

    interval = null;
    timerSecondsTotal = 0;
    isplaying: boolean;
    isLoad: boolean;
    currentPoint: any;
    message: any;

    duration: any = -1;
    position: any = 0;
    myData: MyData
    get_duration_interval: any;
    get_position_interval: any;
    display_position: any = '00:00';
    display_duration: any = '00:00';
    songid: string = "";
    songindex: number = 0;
    constructor(public musicControls: MusicControls,
        private platform: Platform,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private file: File,
        private transfer: FileTransfer,
        private media: Media,
        private datePipe: DatePipe,
        private nativeStorage: NativeStorage,
        private storage: AngularFireStorage,
        private database: AngularFirestore,
    ) {
        this.platform.ready().then(() => {
            if (this.platform.is('ios')) {
              this.storageDirectory = this.file.dataDirectory;
            } else if (this.platform.is('android')) {
              this.storageDirectory = this.file.externalDataDirectory;
            } else {
              this.storageDirectory = this.file.cacheDirectory;
            }
          });
    }
    prepareAudioFile(data: MyData) {
        //let url ='https://ia800207.us.archive.org/29/items/MLKDream/MLKDream_64kb.mp3';
        let url = data.filepath;
        this.platform.ready().then(() => {
            this.file
                .resolveDirectoryUrl(this.storageDirectory)
                .then(resolvedDirectory => {
                    // inspired by: https://github.com/ionic-team/ionic-native/issues/1711
                    //console.log('resolved  directory: ' + resolvedDirectory.nativeURL);
                    this.file
                        .checkFile(resolvedDirectory.nativeURL, this.filename)
                        .then(data => {
                            if (data == true) {
                                // exist
                                this.getDurationAndSetToPlay();
                                let resDIrect = resolvedDirectory.nativeURL + this.filename;

                                //console.log("directory---" + resDIrect);
                            } else {
                                // not sure if File plugin will return false. go to download
                                // console.log('not found!');
                                throw { code: 1, message: 'NOT_FOUND_ERR' };
                            }
                        }).catch(async err => {
                            // console.log('Error occurred while checking local files:');
                            // console.log(err);
                            if (err.code == 1) {
                                // not found! download!
                                // console.log('not found! download!');
                                let loadingEl = await this.loadingCtrl.create({
                                    message: 'वेबवरून भजन डाउनलोड करीत आहे ...'
                                });
                                loadingEl.present();
                                const fileTransfer: FileTransferObject = this.transfer.create();
                                await fileTransfer
                                    .download(url, this.storageDirectory + this.filename)
                                    .then(entry => {
                                        //console.log('download complete' + entry.toURL());
                                        loadingEl.dismiss();
                                        this.getDurationAndSetToPlay();
                                    })
                                    .catch(err_2 => {
                                        //console.log('Download error!');
                                        loadingEl.dismiss();
                                        //console.log(err_2);
                                    });
                            }
                        });
                });
        });
    }
    toHHMMSS(secs) {
        var sec_num = parseInt(secs, 10)
        var minutes = Math.floor(sec_num / 60) % 60
        var seconds = sec_num % 60

        return [minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i >= 0)
            .join(":")
    }

    createAudioFile(pathToDirectory, filename): MediaObject {
        if (this.platform.is('ios')) {
            //ios
            // this.media = new Media();
            return this.media.create(
                pathToDirectory.replace(/^file:\/\//, '') + '/' + filename
            );
        } else {
            // android
            // this.media = new Media();
            return this.media.create(pathToDirectory + filename);
        }
    }
    getDurationAndSetToPlay() {
        this.curr_playing_file = this.createAudioFile(
            this.storageDirectory,
            this.filename
        );
        this.curr_playing_file.play();
        this.curr_playing_file.setVolume(0.0); // you don't want users to notice that you are playing the file
        //  this.playRecording();

        let self = this;

        let displayDuration = self.duration;
        this.get_duration_interval = setInterval(() => {
            if (self.duration === -1 || !self.duration) {
                self.duration = ~~(self.curr_playing_file.getDuration());  // make it an integer
            } else {
                if (self.duration !== displayDuration) {
                    displayDuration = self.duration;
                } else {
                    console.log("stopppppping")
                    self.curr_playing_file.stop();
                    self.curr_playing_file.release();
                    self.curr_playing_file.play();
                    clearInterval(self.get_duration_interval);
                    this.display_duration = this.toHHMMSS(self.duration);
                    self.setToPlayback();
                }
            }
        }, 100);
    }
    setToPlayback() {
        // this.curr_playing_file = this.createAudioFile(
        //   this.storageDirectory,
        //   this.filename
        // );
        this.curr_playing_file.onStatusUpdate.subscribe(status => {
            // 2: playing
            // 3: pause
            // 4: stop
            this.message = status;
            switch (status) {
                case 1:
                    this.is_in_play = false;
                    break;
                case 2: // 2: playing
                    this.is_in_play = true;
                    this.is_playing = true;
                    break;
                case 3: // 3: pause
                    this.is_in_play = true;
                    this.is_playing = false;
                    break;
                case 4: // 4: stop
                default:
                    this.is_in_play = false;
                    this.is_playing = false;
                    break;
            }
        });
        // console.log('audio file set');
        this.message = 'audio file set';
        this.is_ready = true;
        this.getAndSetCurrentAudioPosition();
    }

    getAndSetCurrentAudioPosition() {
        let diff = 1;
        let self = this;
        this.get_position_interval = setInterval(() => {
            let last_position = self.position;
            // this.backgroundMode.enable();
            self.curr_playing_file.getCurrentPosition().then(position => {
                self.position = position;
                this.display_position = this.toHHMMSS(self.position);

            });
        }, 1);


    }
}