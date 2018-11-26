import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";

/**
 * Generated class for the LogisticsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'logistics',
  segment: 'logistics/:objectId/:relname/:name',
})
@Component({
  selector: 'page-logistics',
  templateUrl: 'logistics.html',
})
export class LogisticsPage {
  objectId = '';
  relname = '';
  name = '';
  listArr = [];
  constructor(public navCtrl: NavController,
    public cp: CommonProvider,
    public navParams: NavParams) {
  }
  ionViewDidLoad() {
    this.objectId = this.navParams.get('objectId') || '';
    this.relname = this.navParams.get('relname') || '';
    this.name = this.navParams.get('name') || '';
    this.cp.getData('user/order/logistics', {
      order_sn: this.objectId,
      relname: this.relname
    }).then(
      (t: any) => {
        console.log(t)
        this.listArr = t.data;
      }
    )
  }

}
