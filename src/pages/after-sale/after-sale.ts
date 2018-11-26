import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";

/**
 * Generated class for the AfterSalePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'after-sale'
})
@Component({
  selector: 'page-after-sale',
  templateUrl: 'after-sale.html',
})
export class AfterSalePage {
  pet: string = "0";
  page = 1;
  size = 10;
  orderList = [];
  refoundList = [];
  constructor(public navCtrl: NavController,
    public cp: CommonProvider,
    public navParams: NavParams,
    private alertCtrl: AlertController) {
  }

  ionViewWillEnter() {
    this.saleAfter(0);
    this.saleAfter(1);
  }

  goTo(url) {
    this.cp.goto(url)
  }
  saleAfter(type) {
    // type：  售后：0   进度：1
    this.cp.getData('?m=user&c=refound', {
      page: this.page,
      size: this.size,
      type: type,
      order_id: 0,
      H5API: true,
      silent: true
    }).then(
      (t: any) => {
        if (t.data !== '') {
          if (type == 0) {
            this.orderList = t.order_list;
          } else {
            this.refoundList = t.refound_list;
          }
        }
      }
    )
  }
  delFirm(url) {
    let alert = this.alertCtrl.create({
      title: '提示',
      message: '您确定要取消退换货申请吗？',
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log(url, 'Cancel clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            this.cancel(url);
          }
        }
      ]
    });
    alert.present();
  }
  // 取消退货申请
  cancel(str) {
    let url = '?' + str.split('?')[1];
    this.cp.getData(url, {
      method: 'get',
      H5API: true,
      silent: true
    }).then(
      (t: any) => {
        console.log(t, 'cancel')
      }
    )
  }
}
