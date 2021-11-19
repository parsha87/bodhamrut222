import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, NavController } from '@ionic/angular';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage  {

  @ViewChild("mySlider", { static: true }) slides: IonSlides;

	currentIndex:any= 0;
	totalSlide = 3;
	constructor(private router:Router, public navCtrl: NavController) {
	}

	nextSlide() {
		this.currentIndex++;
		this.slides.slideTo(this.currentIndex);
	}

	prevSlide() {
		this.currentIndex--;
		this.slides.slideTo(this.currentIndex);
	}

	slideChanged() {
		this.currentIndex = this.slides.getActiveIndex();
	}

	finish() {
	//	localStorage.setItem('isIntroDone', 'yes');
		this.navCtrl.navigateForward('home');
	}

	ngOnInit() {
		// do init at here for current route.
	
		setTimeout(() => {
			this.router.navigate(['home']);
		}, 2000);  //2s
	}

}
