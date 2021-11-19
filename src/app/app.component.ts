import { Component, QueryList, ViewChildren } from '@angular/core';

import { IonRouterOutlet, Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  //code for exit app
  // set up hardware back button event.
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;

  //code for exit app
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  currentPageTitle = 'Home';
  selectedIndex:any;
  appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'भजन',
      url: '/musiclist',
      icon: 'musical-notes'
    },
    // {
    //   title: 'Settings',
    //   url: '/settings',
    //   icon: 'settings'
    // },
    {
      title: 'Upload',
      url: '/musicuplod',
      icon: 'settings'
      
    },
    {
      title:'अभिप्राय',
      url:'/feedback',
      icon: 'settings'
    }
  ];
  constructor(
    private fcm: FCM,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router:Router,
    private toastController:ToastController
  ) {
    this.initializeApp();
    this.backButtonEvent();

  }
  subscribeToTopic() {
    this.fcm.subscribeToTopic('enappd');
  }
  getToken() {
    this.fcm.getToken().then(token => {
      // Register your new token in your back-end if you want
      // backend.registerToken(token);
    });
  }
  unsubscribeFromTopic() {
    this.fcm.unsubscribeFromTopic('enappd');
  }
 // active hardware back button
 backButtonEvent() {
  this.platform.backButton.subscribe(async () => {

    this.routerOutlets.forEach(async (outlet: IonRouterOutlet) => {
      if (outlet && outlet.canGoBack()) {
        outlet.pop();

      } else if (this.router.url === '/home') {
        if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
          // this.platform.exitApp(); // Exit from app
          navigator['app'].exitApp(); // work in ionic 4

        } else {
          const toast = await this.toastController.create({
            message: 'Press back again to exit App.',
            duration: 2000,
            position: 'middle'
          });
          toast.present();
          // console.log(JSON.stringify(toast));
          this.lastTimeBackPress = new Date().getTime();
        }
      }
    });
  });
}
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      if (this.platform.is('android')) {
        this.statusBar.styleLightContent();
      }
      setTimeout(() => {
        this.splashScreen.hide();
      }, 1000); 
      this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          console.log("Received in background");
        } else {
          console.log("Received in foreground");
        };
      });

      this.fcm.onTokenRefresh().subscribe(token => {
        // Register your new token in your back-end if you want
        // backend.registerToken(token);
      });
    });

    
  }
}
