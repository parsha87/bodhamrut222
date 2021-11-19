import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MyData } from '../musicuplod/musicupload.model';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonBackButtonDelegate, LoadingController, ModalController, NavController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';


@Component({
  selector: 'app-musiclist',
  templateUrl: './musiclist.page.html',
  styleUrls: ['./musiclist.page.scss'],
})
export class MusiclistPage implements OnInit {
  private bhajanCollection: AngularFirestoreCollection<MyData>;
  //bhajans: Observable<MyData[]> = new Observable<MyData[]>();
  bhajans: MyData[] = [];
  flteredBhajans: MyData[] = [];
  filterTerm: string;
  showAlertMessage:boolean=true;
  searchTerm: string = '';
  searchControl: FormControl;
  searching: any = false;
  songType: string = "0";
  typeLabel: string = "बाबांचें भजन";
  @ViewChild(IonBackButtonDelegate,{static:false}) backButton: IonBackButtonDelegate;

  constructor(private alertCtrl:AlertController, private loadingCtrl:LoadingController, private modalCtrl: ModalController, private activatedRoute: ActivatedRoute, private navCtrl: NavController, private nativeStorage: NativeStorage, private storage: AngularFireStorage, private database: AngularFirestore) {
    this.searchControl = new FormControl();
    this.songType = this.activatedRoute.snapshot.paramMap.get('id')!;     
    this.loadBhajans()
  }

  ngOnInit() {
    let songType: string = this.activatedRoute.snapshot.paramMap.get('id')!;

    this.setFilteredItems();

  }

  async loadBhajans()
  {
    let loader = await this.loadingCtrl.create({
      message: "भजन लोड करीत आहे ...",
    });
    loader.present().then(()=>{
       //this.bhajanCollection = this.database.collection('babaSBhajans', ref => ref.where('bhajanLangType', '==', 'Marathi'));
    this.bhajanCollection = this.database.collection<MyData>('babaSBhajans');
    //this.bhajans = this.bhajanCollection.valueChanges();
    this.bhajanCollection.valueChanges().subscribe(data => {
      this.bhajans = data.sort((a, b) => a .index- b.index);
      if (this.songType == '0') {
        this.typeLabel = "बाबांचें भजन";
        this.flteredBhajans = this.bhajans.filter(x => x.bhajanType === 'Baba Bhajan' && x.bhajanLangType === 'Marathi')
      }
      else {
        this.flteredBhajans = this.bhajans.filter(x => x.bhajanType === 'Bhakt Bhajan' && x.bhajanLangType === 'Marathi')
        this.typeLabel = "भक्तांचें भजन";

      }
    })
    loader.dismiss();
    })

   
  }
  openPlayer(item: MyData) {
    //console.log(item);
    this.nativeStorage.setItem('mydata', item)
      .then(
        () => {
          console.log('Stored item!');
          console.log(item);
        },
        error => console.error('Error storing item', error)
      );
    this.navCtrl.navigateForward(["musiclist/music/player"]);

  }

  openPlayernew(item: MyData) {
    //console.log(item);
    // this.nativeStorage.setItem('mydata', item)
    //   .then(
    //     () => {
    //       console.log('Stored item!');
    //       console.log(item);
    //     },
    //     error => console.error('Error storing item', error)
    //   );


    sessionStorage.setItem("mydata", JSON.stringify(item));
    this.navCtrl.navigateForward(["musiclist/music/playernew"]);

  }
  setFilteredItems() {

    //  this.bhajans = this.dataService.filterItems(this.searchTerm);

  }
  async IonViewWillEnter() {
    if(this.showAlertMessage) {
      return new Promise<void>(async (resolve, reject) => {
        let confirm = this.alertCtrl.create({
            message: 'Leave the page ?',
            buttons: [
                {
                text: 'Yes',
                handler: () => {
                  resolve();
                }
                },
                {
                text: 'No',
                handler: () => {
                  reject();
                }
              }
            ]
            });
        (await confirm).present();
    });

        // Return false to avoid the page to be popped up
        //return false;
    }
}

private exitPage() {
    this.showAlertMessage = false;
    this.navCtrl.pop();
}
  showGrid(flag: number) {
    if (flag === 1) {
      /// this.bhajanCollection.valueChanges().subscribe(data => {
      if (this.songType == '0') {
        this.flteredBhajans = this.bhajans.filter(x => x.bhajanType === 'Baba Bhajan' && x.bhajanLangType === 'Marathi')
      }
      else {
        this.flteredBhajans = this.bhajans.filter(x => x.bhajanType === 'Bhakt Bhajan' && x.bhajanLangType === 'Marathi')

      }
      // this.flteredBhajans=  this.bhajans.filter(x => x.bhajanLangType === 'Marathi');        
      // })
    }
    else {
      // this.bhajanCollection = this.database.collection('babaSBhajans', ref => ref.where('bhajanLangType', '==', 'Hindi'));
      // //this.bhajanCollection = database.collection<MyData>('babaSBhajans');
      // this.bhajans = this.bhajanCollection.valueChanges();

      //Update
      //       firebase
      // .firestore()
      // .collection("clubs")
      // .doc(documentId)
      // .update({
      //  title: this.state.title,
      //  titleAsArray: array
      // })
      // this.bhajanCollection.valueChanges().subscribe(data => {
      // this.flteredBhajans=  this.bhajans.filter(x => x.bhajanLangType === 'Hindi');
      //})

      if (this.songType == '0') {
        this.flteredBhajans = this.bhajans.filter(x => x.bhajanType === 'Baba Bhajan' && x.bhajanLangType === 'Hindi')
      }
      else {
        this.flteredBhajans = this.bhajans.filter(x => x.bhajanType === 'Bhakt Bhajan' && x.bhajanLangType === 'Hindi')

      }
    }
  }

  geBhajansById(id) {

  }

  async openModal(lyrics: string, name: string) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'lyrics': lyrics,
        'name': name

      }
    });
    return await modal.present();
  }
}
