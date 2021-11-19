import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MusicuplodPage } from './musicuplod.page';
import { FormatFileSizePipe } from '../helperpipe/format-file-size.pipe';
import { UploadmusiclistPage } from './uploadmusiclist/uploadmusiclist.page';

const routes: Routes = [
  {
    path: '',
    component: UploadmusiclistPage
  },
  {
    path: ':id',
    component: MusicuplodPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MusicuplodPage,FormatFileSizePipe,UploadmusiclistPage]
})
export class MusicuplodPageModule {}
