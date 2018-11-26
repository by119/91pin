import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";

/**
 * Generated class for the AfterProgressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'after-progress'
})
@Component({
  selector: 'page-after-progress',
  templateUrl: 'after-progress.html',
})
export class AfterProgressPage {
  @ViewChild(Slides) slides:Slides;
  showSlides: boolean = false;
  slideImgs: any = [];  

  url = '';
  returnDetail = {};
  shippingList = {};

  constructor(public navCtrl: NavController,
    public cp: CommonProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.url = '?' + this.navParams.get('refound_detail_url').split('?')[1];
    this.detail();
  }
  goTo(url) {
    this.cp.goto(url)
  }
  detail() {
    this.cp.getData(this.url, {
      method: 'get',
      H5API: true,
      silent: true
    }).then(
      (t: any) => {
        this.returnDetail = t.return_detail;
        this.shippingList = t.shipping_list;
      }
    )
  }

  showSlide(imgs: any, index:number = 0) {
    this.showSlides = true;

    if(this.slideImgs.length && this.slideImgs[0] != imgs[0])
        this.slideImgs = []; //不同组 则清空 并 过100毫秒后重新赋值
      
        setTimeout(() => this.slideImgs = imgs, 20);
        if(this.slides.length() && this.slides.length() == this.slideImgs.length)
          this.slides.slideTo(index,0,true)
        else{
          let timer = setInterval(()=>{
            //slides加载完毕后 再滑到指定slide
            this.slides.length() == this.slideImgs.length && (clearInterval(timer),this.slides.slideTo(index,0,true))
          },25)
        }
  }

  toggleSlide() {
    this.showSlides = false;
    // setTimeout(() => this.slideImgs = [], 100)
  }
}
