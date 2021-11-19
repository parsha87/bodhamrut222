import { Component, OnInit, QueryList, ViewChild } from '@angular/core';
import {
  NavController,
  LoadingController,
  Platform,
  ToastController,
  IonRouterOutlet,
  AlertController
} from '@ionic/angular';
import { DatePipe } from '@angular/common';

import {
  FileTransfer,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { MyData } from '../musicuplod/musicupload.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { MusicControls } from '@ionic-native/music-controls/ngx';
import { AudioProvider } from './AudioProvider';
import { Router } from '@angular/router';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'app-musicplayer',
  templateUrl: './musicplayer.Page.html',
  styleUrls: ['./musicplayer.Page.scss'],
})
export class MusicplayerPage implements OnInit {
  title = 'भक्तराज भोधामृत';
  filename = 'I_Have_a_Dream.mp3';
  lyrics: string = '';
  curr_playing_file: MediaObject = null;
  curr_playing_file_obs = new BehaviorSubject<MediaObject>(null);
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
  subscription: any
  duration: any = -1;
  position: any = 0;
  myData: MyData
  get_duration_interval: any;
  get_position_interval: any;
  display_position: any = '00:00';
  display_duration: any = '00:00';
  songid: string = "";
  songindex: number = 0;
  bhajans: Observable<MyData[]>;
  private bhajanCollection: AngularFirestoreCollection<MyData>;
  @ViewChild(IonRouterOutlet, { static: false }) routerOutlets: QueryList<IonRouterOutlet>;
  tobeplayed: boolean = true;
  // track = {
  //   src: 'https://ia801609.us.archive.org/16/items/nusratcollection_20170414_0953/Man%20Atkiya%20Beparwah%20De%20Naal%20Nusrat%20Fateh%20Ali%20Khan.mp3',
  //   artist: 'Nusrat Fateh Ali Khan',
  //   title: 'Man Atkiya Beparwah De Naal',
  //   art: 'https://ia801307.us.archive.org/31/items/mbid-42764450-04e5-459e-b022-00847fc8fb94/mbid-42764450-04e5-459e-b022-00847fc8fb94-12391862253_thumb250.jpg',
  //   preload: 'metadata' // tell the plugin to preload metadata such as duration for this track,  set to 'none' to turn off
  // };
  constructor(
    public navCtrl: NavController, public musicControls: MusicControls,
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
    private router: Router,
    private alertCtrl: AlertController
    // private backgroundMode: BackgroundMode
  ) {
    //All Bhajans Lists
    this.bhajanCollection = database.collection<MyData>('babaSBhajans');
    this.bhajans = this.bhajanCollection.valueChanges();

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

  ngOnInit() {
    //this.backgroundMode.enable();
    //this.lyrics = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna. Sed consequat, leo eget bibendum sodales, augue velit cursus nunc,"
    //let songid: string = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.nativeStorage.getItem('mydata')
      .then(
        data => {
          this.songid = data.id;
          this.filename = data.name;
          this.title = data.displayName;
          this.lyrics = data.lyrics;
          this.songindex = data.index;
          this.bhajansData = data;
          //Prepare audio file         
          this.prepareAudioFile(data);
        },
        error => { console.error(error) }
      );
  }


  async prepareAudioFile(data: MyData) {
    //let url ='https://ia800207.us.archive.org/29/items/MLKDream/MLKDream_64kb.mp3';
    let url = data.filepath;
    console.log(data.filepath);
    this.platform.ready().then(() => {
      // this.platform.backButton.subscribe(() => {
      //   this.platform.backButton.observers.pop();

      // }); 

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
                  message: 'वेबवरून भजन डाउनलोड करीत आहे.<br/><br/> प्रथमच भजन ऐकण्यासाठी आपल्यास सक्रिय इंटरनेट कनेक्शनची आवश्यकता आहे. नंतर तुम्ही इंटरनेट शिवाय भजन ऐकू शकता.'
                });
                loadingEl.present().then((res) => {
                  this.tobeplayed = false;
                  const fileTransfer: FileTransferObject = this.transfer.create();
                  fileTransfer
                    .download(url, this.storageDirectory + this.filename)
                    .then(entry => {
                      //console.log('download complete' + entry.toURL());
                      loadingEl.dismiss();
                      this.tobeplayed = true
                      if (this.tobeplayed) {
                        console.log("tobe" + this.tobeplayed)
                        this.getDurationAndSetToPlay();
                      }
                    })
                    .catch(err_2 => {
                      //console.log('Download error!');
                      loadingEl.dismiss();
                      //console.log(err_2);
                    });

                  //   res.onDidDismiss().then((d) => {
                  //     this.platform.backButton.observers.pop();
                  // })

                },error=>{
                  console.log(error);
                });

              }
            });
        });
    });
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
    this.curr_playing_file.play({ playAudioWhenScreenIsLocked: true, numberOfLoops: 0 });
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
          self.curr_playing_file.play({ playAudioWhenScreenIsLocked: true, numberOfLoops: 0 });
         self.settingMusicControl();
          clearInterval(self.get_duration_interval);
          this.display_duration = this.toHHMMSS(self.duration);
          self.setToPlayback();
        }
      }
    }, 100);
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
  getAndSetCurrentAudioPosition() {
    let diff = 1;
    let self = this;
    this.get_position_interval = setInterval(() => {
      let last_position = self.position;
      // this.backgroundMode.enable();
      self.curr_playing_file.getCurrentPosition().then(position => {
        self.position = position;
        this.display_position = this.toHHMMSS(self.position);
        // if (position >= 0 && position < self.duration) {
        //   if (Math.abs(last_position - position) >= diff) {
        //     // set position
        //     self.curr_playing_file.seekTo(last_position * 1000);
        //   } else {
        //     // update position for display
        //     self.position = position;
        //     this.display_position = this.toHHMMSS(self.position);
        //   }
        // } else if (position >= self.duration) {
        //   // self.stopPlayRecording();
        //   // self.setToPlayback();
        // }
      });
    }, 1);


    // function timer end



    // this.get_position_interval = setInterval(() => {
    //   console.log("in getAndSetCurrentAudioPosition")
    //   var currentTickTimestamp = Date.now()
    //   var delta = currentTickTimestamp - prevTickTimestamp

    //   this.timerSecondsTotal += Math.round(delta / 1000)
    //   console.log("new t" + this.timerSecondsTotal)      
    //   prevTickTimestamp = currentTickTimestamp

    //   console.log(self.position)

    //   let last_position = self.position;
    //   self.curr_playing_file.getCurrentPosition().then(position => {
    //     if (position >= 0 && position < self.duration) {
    //       if (Math.abs(last_position - position) >= diff) {
    //         // set position
    //         console.log("setting postion")
    //         self.curr_playing_file.seekTo(last_position * 1000);
    //       } else {
    //         // update position for display
    //         self.position = position;
    //         this.display_position = this.toHHMMSS(self.position);
    //       }
    //     } else if (position >= self.duration) {
    //       console.log("here in else");
    //       self.stopPlayRecording();
    //       self.setToPlayback();
    //     }
    //   });
    // }, 100);
  }
  // this does not work
  controlProgressBar(event) {
    var self = this;
    if (this.is_playing == true) {
      setInterval(function () {
        self.curr_playing_file.getCurrentPosition().then((position) => {
          self.position = position;
          this.display_position = this.toHHMMSS(self.position);
        });
      }, 1000);
    }
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

  playRecording() {

    this.curr_playing_file.play({ playAudioWhenScreenIsLocked: true, numberOfLoops: 0 });
    this.settingMusicControl();
    this.toastCtrl
      .create({
        message: `Start playing from ${this.toHHMMSS(this.position)}`,
        duration: 2000
      })
      .then(toastEl => toastEl.present());
  }

  pausePlayRecording() {
    this.curr_playing_file.pause();
    this.musicControls.listen();
    this.musicControls.updateIsPlaying(false);
    this.toastCtrl
      .create({
        message: `Paused at ${this.toHHMMSS(this.position)}`,
        duration: 2000
      })
      .then(toastEl => toastEl.present());
  }

  stopPlayRecording() {
    this.curr_playing_file.stop();
    this.curr_playing_file.release();
    clearInterval(this.get_position_interval);
    this.position = 0;
  }

  controlSeconds(action) {
    let step = 10;
    let number = this.position;
    switch (action) {
      case 'back':
        this.position = number < step ? 0.001 : number - step;
        this.curr_playing_file.seekTo(this.position * 1000);
        // this.toastCtrl
        //   .create({
        //     message: `Went back ${step} seconds`,
        //     duration: 2000
        //   })
        //   .then(toastEl => toastEl.present());
        break;
      case 'forward':
        this.position =
          number + step < this.duration ? number + step : this.duration;
        this.curr_playing_file.seekTo(this.position * 1000);
        // this.toastCtrl
        //   .create({
        //     message: `Went forward ${step} seconds`,
        //     duration: 2000
        //   })
        //   .then(toastEl => toastEl.present());
        break;
      default:
        break;
    }
  }

  fmtMSS(s) {
    // return this.datePipe.transform(s * 1000, 'mm:ss');

    /** The following has been replaced with Angular DatePipe */
    // // accepts seconds as Number or String. Returns m:ss
    return (
      (s - // take value s and subtract (will try to convert String to Number)
        (s %= 60)) / // the new value of s, now holding the remainder of s divided by 60
      // (will also try to convert String to Number)
      60 + // and divide the resulting Number by 60
      // (can never result in a fractional value = no need for rounding)
      // to which we concatenate a String (converts the Number to String)
      // who's reference is chosen by the conditional operator:
      (9 < s // if    seconds is larger than 9
        ? ':' // then  we don't need to prepend a zero
        : ':0') + // else  we do need to prepend a zero
      s
    ); // and we add Number s to the string (converting it to String as well)
  }

  async ngOnDestroy() {
    // this.curr_playing_file.release();
    //this.curr_playing_file.stop();
    
    if (this.is_playing || this.is_in_play) {
      this.stopPlayRecording();
      this.musicControls.destroy();
    }
    //this.backgroundMode.disable();
    this.tobeplayed = false;
    console.log("tobedestr" + this.tobeplayed)

    // this.tobeplayed = false;
    // console.log("tobedestrionViewDidLeave" + this.tobeplayed)
    // let alert = this.alertCtrl.create({
    //   message: 'You can\'t leave',
    //   buttons: ['Oh sorry']
    // });
    // (await alert).present();
    // return false;


  }

  settingMusicControl() {
    this.musicControls.destroy(); // it's the same with or without the destroy 
    this.musicControls.create({
      track: this.title,        // optional, default : ''
      artist: "प. पु.भक्तराज महाराज",                       // optional, default : ''
      cover: "../../assets/img/icon.png",      // optional, default : nothing
      // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
      //           or a remote url ('http://...', 'https://...', 'ftp://...')
      isPlaying: true,                         // optional, default : true
      dismissable: true,                         // optional, default : false

      // hide previous/next/close buttons:
      hasPrev: false,      // show previous button, optional, default: true
      hasNext: false,      // show next button, optional, default: true
      hasClose: true,       // show close button, optional, default: false
      hasSkipForward: false,  // show skip forward button, optional, default: false
      hasSkipBackward: false, // show skip backward button, optional, default: false
      skipForwardInterval: 15, // display number for skip forward, optional, default: 0
      skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
      // iOS only, optional
      album: 'प. पु.भक्तराज महाराज',     // optional, default: ''
      duration: 0, // optional, default: 0
      elapsed: 0, // optional, default: 0

      // Android only, optional
      // text displayed in the status bar when the notific\ation (and the ticker) are updated
      ticker: 'Now playing test'
    });

    this.musicControls.subscribe().subscribe((action) => {
      // console.log('action', action);
      const message = JSON.parse(action).message;
      // console.log('message', message);
      switch (message) {
        case 'music-controls-next':
          // Do something
          break;
        case 'music-controls-previous':
          // Do something
          break;
        case 'music-controls-pause':
          // Do something
          //  console.log('music pause');
          this.curr_playing_file.pause();
          this.musicControls.listen();
          this.musicControls.updateIsPlaying(false);
          break;
        case 'music-controls-play':
          // Do something
          // console.log('music play');
          this.curr_playing_file.play({ playAudioWhenScreenIsLocked: true, numberOfLoops: 0 });
          this.musicControls.listen();
          this.musicControls.updateIsPlaying(true);
          break;
        case 'music-controls-destroy':
          // Do something
          this.stopPlayRecording();
          this.musicControls.destroy();
          break;
        // External controls (iOS only)
        case 'music-controls-toggle-play-pause':
          // Do something
          break;
        case 'music-controls-seek-to':
          // Do something
          break;
        case 'music-controls-skip-forward':
          // Do something
          break;
        case 'music-controls-skip-backward':
          // Do something
          break;

        // Headset events (Android only)
        // All media button events are listed below
        case 'music-controls-media-button':
          // Do something
          break;
        case 'music-controls-headset-unplugged':
          // Do something
          break;
        case 'music-controls-headset-plugged':
          // Do something
          break;
        default:
          break;
      }
    });
    this.musicControls.listen(); // activates the observable above
    this.musicControls.updateIsPlaying(true);
  }

  //Play Previous Audio
  playPrevAudio() {
    this.bhajans.subscribe(data => {
      let bhajanind = data.findIndex(x => x.id == this.bhajansData.id);
      let index = +bhajanind - 1
      let bhajan = data[index];
      if (bhajanind >= 0) {
        this.musicControls.destroy();
        this.songid = bhajan.id;
        this.filename = bhajan.name;
        this.title = bhajan.name;
        this.lyrics = bhajan.lyrics;
        this.songindex = bhajan.index;
        this.bhajansData = bhajan;
        this.stopPlayRecording();
        this.prepareAudioFile(this.bhajansData);
      }
      else {
        this.toastCtrl
          .create({
            message: `भजन सापडला नाही!!`,
            duration: 2000
          })
          .then(toastEl => toastEl.present());
      }


    });
  }
  //Play next Audio
  playNextAudio() {
    this.bhajans.subscribe(data => {
      let bhajanind = data.findIndex(x => x.id == this.bhajansData.id);
      let index = +bhajanind + 1
      let bhajan = data[index];
      if (bhajanind >= 0) {
        this.musicControls.destroy();
        this.songid = bhajan.id;
        this.filename = bhajan.name;
        this.title = bhajan.name;
        this.lyrics = bhajan.lyrics;
        this.songindex = bhajan.index;
        this.bhajansData = bhajan;
        if (this.is_in_play) {
          this.stopPlayRecording();

        }
        if(bhajan.filepath!="")
        {
          this.prepareAudioFile(this.bhajansData);
        }
        else
        {
          this.playNextAudio();
        }

        

      }
      else {
        this.toastCtrl
          .create({
            message: `भजन सापडला नाही!`,
            duration: 2000
          })
          .then(toastEl => toastEl.present());

      }
    });
  }
  onBackKeyDown(e) {
    e.preventDefault();
  }

  ionViewDidLeave() {

  }
  async ionViewWillLeave() {
    // this.tobeplayed = false;
    // console.log("tobedestrionViewDidLeave" + this.tobeplayed)
    // let alert = this.alertCtrl.create({
    //   message: 'You can\'t leave',
    //   buttons: ['Oh sorry']
    // });
    // (await alert).present();
    // return false;
    this.musicControls.destroy();

  }
  ionViewDidEnter() {

    this.musicControls.destroy();
    this.platform.backButton.subscribeWithPriority(10, () => {
      document.addEventListener("backbutton", this.onBackKeyDown, false);
      console.log("stopping..........")

    });

    this.subscription = this.platform.backButton.subscribe(async (event: any) => {
      event.preventDefault();
      try {
        const element = await this.loadingCtrl.getTop();
        if (element) {
          element.dismiss();
          return;
        }
      } catch (error) {
      }
    });


  }
}
