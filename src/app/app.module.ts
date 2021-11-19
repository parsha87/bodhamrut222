import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { File } from '@ionic-native/file/ngx';
import {
  FileTransfer,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';
import { Media } from '@ionic-native/media/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ModalPage } from './modal/modal.page';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { MusicControls } from '@ionic-native/music-controls/ngx';
import { AudioProvider } from './musicplayer/AudioProvider';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PrakashanPage } from './prakashan/prakashan.page';
import { MusicCanDeactivateGuard } from './guard/music-can-deactivate-guard.service';
import { CanDeactivateGuard } from './guard/can-deactivate-guard.service';
import { DialogService } from './guard/dialog.service';
import { FCM } from '@ionic-native/fcm/ngx';

@NgModule({
  declarations: [AppComponent, ModalPage, PrakashanPage],
  entryComponents: [ModalPage, PrakashanPage],
  imports: [
    BrowserModule,
    CommonModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    NgxIonicImageViewerModule
  ],
  providers: [
    DialogService ,
    StatusBar,
    SplashScreen,
    Media,
    File,
    FileTransfer,
    FileTransferObject,
    DatePipe,
    NativeStorage,
    MusicControls,
    AudioProvider,
    PhotoViewer,
    BackgroundMode,
    FCM,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    CanDeactivateGuard,
    MusicCanDeactivateGuard

  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
