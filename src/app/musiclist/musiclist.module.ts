import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MusiclistPage } from './musiclist.page';
import { MusicplayerPage } from '../musicplayer/musicplayer.page';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { MusicCanDeactivateGuard } from '../guard/music-can-deactivate-guard.service';

const routes: Routes = [
  {
    path: '',
    component: MusiclistPage
  },
  {
    path: ':id',
    component: MusiclistPage
  },
  // { path: 'musicplayer/:method/:id', component: MusicplayerComponent },
  {
    path: 'music/player',
    component: MusicplayerPage,
    canDeactivate:[MusicCanDeactivateGuard]
  },

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2SearchPipeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MusiclistPage,MusicplayerPage],
})
export class MusiclistPageModule {}
