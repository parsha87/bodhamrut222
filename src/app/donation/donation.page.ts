import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PrakashanPage } from '../prakashan/prakashan.page';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.page.html',
  styleUrls: ['./donation.page.scss'],
})
export class DonationPage implements OnInit {
  currentImage: any;
  photo = ["../../assets/img/Publications/1.jpeg", "../../assets/img/Publications/1b.jpeg"];
  photo2 = ["../../assets/img/Publications/2.jpeg", "../../assets/img/Publications/2b.jpeg"];
  photo3 = ["../../assets/img/Publications/3.jpeg", "../../assets/img/Publications/3b.jpeg"];
  photo4 = ["../../assets/img/Publications/4.jpeg", "../../assets/img/Publications/4b.jpeg"];
  photo5 = ["../../assets/img/Publications/5.jpeg", "../../assets/img/Publications/5b.jpeg"];
  photo6 = ["../../assets/img/Publications/6.jpeg", "../../assets/img/Publications/6b.jpeg"];
  photo7 = ["../../assets/img/Publications/7.jpeg", "../../assets/img/Publications/7b.jpeg"];
  photo8 = ["../../assets/img/Publications/8.jpeg", "../../assets/img/Publications/8b.jpeg", 
   "../../assets/img/Publications/8c.jpeg", "../../assets/img/Publications/8d.jpeg", "../../assets/img/Publications/8e.jpeg"
   , "../../assets/img/Publications/8f.jpeg", "../../assets/img/Publications/8g.jpeg"];
  imgThumbnail = {
    id: 1040,
    src: 'https://picsum.photos/id/1040/200/200.jpg',
    srcHighRes: 'https://picsum.photos/id/1040/4496/3000.jpeg',
    author: 'Rachel Davis',
  };

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
    //this.photoService.loadSaved();
  }

  async OpenModal(id: number) {

    const modal = await this.modalCtrl.create({
      component: PrakashanPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'photoid': id,
      }
    });
    return await modal.present();
  }
}

