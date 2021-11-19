import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-prakashan',
  templateUrl: './prakashan.page.html',
  styleUrls: ['./prakashan.page.scss'],
})
export class PrakashanPage implements OnInit {
  @Input() photoid: number;
content:string ="";
name:string=""
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
   
  }
  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
