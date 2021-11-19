import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NavController,
  LoadingController,
  Platform,
  ToastController,
  IonSlides,
  IonRouterOutlet
} from '@ionic/angular';
import { DatePipe } from '@angular/common';

import {
  FileTransfer,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {
  public subscription: any;

  storageDirectory: any;

  message: any;
  //slider: any;
  slideOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: true
  }

  slideOpts = {
    zoom: {
      maxRatio: 5
    },
    autoplay: true
  };

  @ViewChild("mySlider", { static: true }) slides: IonSlides;
  options: {
    autoplay: true
  }
  slideData = ["assets/img/ss1.jpeg", "assets/img/ss2.jpeg", "assets/img/ss3.jpeg"]
  constructor(
    private platform: Platform,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private file: File,
    private transfer: FileTransfer,
    private media: Media,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private routerOutlet: IonRouterOutlet
  ) {
    // this.platform.backButton.subscribe(()=>{
    //   console.log ('exit');
    //   navigator['app'].exitApp();
    //   });
  }

  ngOnInit() {
    //  this.slideChanged()
  }


  openMusicPlayer(type: number) {

  }


  slideChanged() {
    this.slides.stopAutoplay(); //this code for slide after page change
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribe(() => {
      navigator['app'].exitApp();
    });
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  slidesDidLoad() {
    //  this.slides.startAutoplay();
  }
}


