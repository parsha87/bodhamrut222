import { Component, OnInit } from '@angular/core';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-photo',
  templateUrl: './photo.page.html',
  styleUrls: ['./photo.page.scss'],
})
export class PhotoPage implements OnInit {
  currentImage: any;
photo=["../../assets/img/Photo/1.jpeg",
"../../assets/img/Photo/2.jpeg","../../assets/img/Photo/3.jpeg",
"../../assets/img/Photo/4.jpeg","../../assets/img/Photo/5.jpeg","../../assets/img/Photo/6.jpeg",
"../../assets/img/Photo/7.jpeg",
"../../assets/img/Photo/8.jpeg",
"../../assets/img/Photo/9.jpeg",
"../../assets/img/Photo/10.jpeg",
"../../assets/img/Photo/11.jpeg",
"../../assets/img/Photo/12.jpeg",
"../../assets/img/Photo/13.jpeg",
"../../assets/img/Photo/14.jpeg",
"../../assets/img/Photo/15.jpeg"];
imgThumbnail = {
  id: 1040,
  src: 'https://picsum.photos/id/1040/200/200.jpg',
  srcHighRes: 'https://picsum.photos/id/1040/4496/3000.jpg',
  author: 'Rachel Davis',
};

  constructor(private photoViewer: PhotoViewer) { }

  ngOnInit() {
    //this.photoService.loadSaved();
  }

  openImage(path:string) {
    console.log(path);
    var options = {
      share: true, // default is false
      closeButton: false, // iOS only: default is true
      copyToReference: true // iOS only: default is false
      };
    this.photoViewer.show(path, "प. पु.भक्तराज महाराज",options);
} 
  

}
