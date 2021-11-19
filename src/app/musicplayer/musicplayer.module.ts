import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MusiclistComponent } from './musiclist/musiclist.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

const musicRoutes: Routes = [
  {
    path: '',
    component: MusiclistComponent
  },
  // {
  //   path: 'player',
  //   component: MusicplayerComponent
  // },  
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(musicRoutes),
  ],
  declarations: [MusiclistComponent]

})
export class MusicplayerModule { }
