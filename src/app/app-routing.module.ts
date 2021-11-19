import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { environment } from 'src/environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
  { path: '', redirectTo: 'intro', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'musicplayer', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'events', loadChildren: './events/events.module#EventsPageModule' },
  { path: 'donation', loadChildren: './donation/donation.module#DonationPageModule' },
  { path: 'photo', loadChildren: './photo/photo.module#PhotoPageModule' },
  { path: 'trustinfo', loadChildren: './trustinfo/trustinfo.module#TrustinfoPageModule' },
  { path: 'musiclist', loadChildren: './musiclist/musiclist.module#MusiclistPageModule' },
  { path: 'musicuplod', loadChildren: './musicuplod/musicuplod.module#MusicuplodPageModule' },
  { path: 'modal', loadChildren: './modal/modal.module#ModalPageModule' },
  { path: 'intro', loadChildren: './intro/intro.module#IntroPageModule' },
  { path: 'feedback', loadChildren: './feedback/feedback.module#FeedbackPageModule' },
  // { path: 'musicplayernew', loadChildren: './musicplayer/musicplayernew/musicplayernew.module#MusicplayernewPageModule' },
];

@NgModule({
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
