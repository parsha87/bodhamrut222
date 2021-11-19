import { Component } from '@angular/core';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MyData } from './musicupload.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-musicuplod',
  templateUrl: './musicuplod.page.html',
  styleUrls: ['./musicuplod.page.scss'],
})
export class MusicuplodPage {
  // Upload Task 
  task: AngularFireUploadTask;

  // Progress in percentage
  percentage: Observable<number>;

  // Snapshot of uploading file
  snapshot: Observable<any>;

  // Uploaded File URL
  UploadedFileURL: Observable<string>;

  //Uploaded Image List
  bhajans: Observable<MyData[]>;
  //bhajans: MyData[] = [];

  mydataInfo: MyData = new MyData();
  isEdit: boolean = false;
  uploadedFile: any;
  //File details  
  fileName: string;
  fileSize: number;
  bhajanId: string = "";
  //Status check 
  isUploading: boolean;
  isUploaded: boolean;
  method: string = "add";
  private bhajanCollection: AngularFirestoreCollection<MyData>;
  constructor(private router: Router, private toastCtrl: ToastController, private activatedRoute: ActivatedRoute, private storage: AngularFireStorage, private database: AngularFirestore) {
    this.isUploading = false;
    this.isUploaded = false;
    //Set collection where our documents/ images info will save
    //this.imageCollection = database.collection<MyData>('babaSBhajans');
    this.bhajanId = this.activatedRoute.snapshot.paramMap.get('id')!;
    // Method-Add/Edit
    this.bhajanCollection = this.database.collection('babaSBhajans', ref => ref.where('id', '==', this.bhajanId));
    this.bhajans = this.bhajanCollection.valueChanges();


  }

  ngOnInit() {
    if (this.bhajanId != "0") {
      //Edit
      this.isEdit = true;
      this.bhajans.subscribe((res: MyData[]) => {
        this.mydataInfo = res[0];
      });
    }
  }
  UpdateSong() {

  }

  uploadSong() {
    this.fileName = this.uploadedFile.name;
    this.isUploading = true;
    this.isUploaded = false;
    this.fileName = this.uploadedFile.name;
    // The storage path
    const path = `fileStorage/${new Date().getTime()}_${this.uploadedFile.name}`;

    // Totally optional metadata
    const customMetadata = { app: 'Mp3 Upload' };

    //File reference
    const fileRef = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, this.uploadedFile, { customMetadata });

    // Get file progress percentage
    this.percentage = this.task.percentageChanges();
    this.snapshot = this.task.snapshotChanges().pipe(

      finalize(() => {
        // Get uploaded file storage path
        this.UploadedFileURL = fileRef.getDownloadURL();

        this.UploadedFileURL.subscribe(resp => {
          this.addImagetoDB({
            id: '',
            name: this.uploadedFile.name,
            filepath: resp,
            size: this.fileSize,
            alternateName: this.mydataInfo.alternateName,
            bhajanType: this.mydataInfo.bhajanType,
            bhajanLangType: this.mydataInfo.bhajanLangType,
            lyrics: this.mydataInfo.lyrics,
            displayName: this.mydataInfo.displayName,
            index: this.mydataInfo.index
          });
          this.isUploading = false;
          this.isUploaded = true;
          this.toastCtrl
            .create({
              message: `File Uploaded sucessfully!`,
              duration: 2000
            })
            .then(toastEl => toastEl.present());
        }, error => {
          console.error(error);
        })
      }),
      tap(snap => {
        this.fileSize = snap.totalBytes;
      })
    )
  }

  uploadSongWithOutFile() {
    this.fileName = "";
    // this.isUploading = true;
    // this.isUploaded = false;
    this.fileName = "";
    // The storage path
    const path = "";




    this.addImagetoDB({
      id: '',
      name: this.mydataInfo.alternateName + ".mp3",
      filepath: "",
      size: 0,
      alternateName: this.mydataInfo.alternateName,
      bhajanType: this.mydataInfo.bhajanType,
      bhajanLangType: this.mydataInfo.bhajanLangType,
      lyrics: this.mydataInfo.lyrics,
      displayName: this.mydataInfo.displayName,
      index: this.mydataInfo.index
    });
    //    this.isUploading = false;
    ///  this.isUploaded = true;
    this.toastCtrl
      .create({
        message: `File Uploaded sucessfully!`,
        duration: 2000
      })
      .then(toastEl => toastEl.present());



  }

  uploadFile(event: FileList) {


    // The File object
    const file = event.item(0)
    this.uploadedFile = file;
    // Validation for Images Only
    if (file.type.split('/')[0] !== 'audio') {
      console.error('unsupported file type :( ');
      this.toastCtrl
        .create({
          message: `File not supported. Upload .mp3 file`,
          duration: 2000
        })
        .then(toastEl => toastEl.present());
      this.uploadFile = null;
      return;
    }

  }

  back() {
    this.router.navigate(["/musicuplod"])
  }

  addImagetoDB(image: MyData) {
    //Create an ID for document
    const id = this.database.createId();
    image.id = id;
    //Set document id with value in database
    this.bhajanCollection.doc(id).set(image).then(resp => {
      console.log(resp);
      this.toastCtrl
        .create({
          message: `File Uploaded sucessfully!`,
          duration: 2000
        })
        .then(toastEl => toastEl.present());
      this.mydataInfo = new MyData();
    }).catch(error => {
      console.log("error " + error);
    });
  }

  updatetoDB() {
    //Create an ID for document
    //Set document id with value in database
    const bhajanObject = { ...this.mydataInfo };
    this.database.doc('babaSBhajans/' + this.mydataInfo.id).update(bhajanObject).then(resp => {
      console.log(resp);
    }).catch(error => {
      console.log("error " + error);
    });

  }

}
