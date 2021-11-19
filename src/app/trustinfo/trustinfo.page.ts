import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trustinfo',
  templateUrl: './trustinfo.page.html',
  styleUrls: ['./trustinfo.page.scss'],
})
export class TrustinfoPage implements OnInit {
showinfo:boolean = true
showinfo2:boolean = false

  constructor() { }

  ngOnInit() {
  }

  setScreen(no:number)
  {
    if(no===1){
      this.showinfo= true;
      this.showinfo2 =false;
    }
    else{
      this.showinfo= false;
      this.showinfo2 =true;
    }
  }
}
