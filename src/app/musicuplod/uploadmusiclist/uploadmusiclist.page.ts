import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { MyData } from '../musicupload.model';

@Component({
  selector: 'app-uploadmusiclist',
  templateUrl: './uploadmusiclist.page.html',
  styleUrls: ['./uploadmusiclist.page.scss'],
})
export class UploadmusiclistPage implements OnInit {
  //Uploaded Image List
  //bhajans: Observable<MyData[]>;
  bhajans: MyData[] = [];
  private bhajanCollection: AngularFirestoreCollection<MyData>;
  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController, private router: Router,
    private storage: AngularFireStorage,
    private database: AngularFirestore) {
    //Set collection where our documents/ images info will save
    this.bhajanCollection = database.collection<MyData>('babaSBhajans');
    //    this.bhajans = this.bhajanCollection.valueChanges();
    this.bhajanCollection.valueChanges().subscribe(data => {
      this.bhajans = data.sort((a, b) => a.index - b.index);

    })

  }

  ngOnInit() {

  }

  addBhajans() {
    this.router.navigate(["musicuplod/0"]);

  }
  EditMusic(item: MyData) {
    this.router.navigate(["musicuplod/" + item.id]);
  }
  async deleteMusic(item: MyData) {


    const alert = await this.alertCtrl.create({
      message: 'Are you sure you want to delete the Bhajan?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: blah => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Okay',
          handler: () => {
            // Create a reference to the file to delete
            if (item.filepath != "") {
              this.storage.storage.refFromURL(item.filepath).delete().then(() => {
                this.database.doc('babaSBhajans/' + item.id).delete().then(() => {
                });
              })
            }
            else {
              this.database.doc('babaSBhajans/' + item.id).delete().then(() => {
              });

            }

          },
        },
      ],
    });
    await alert.present();
  }
}
