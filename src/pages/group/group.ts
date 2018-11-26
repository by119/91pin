import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name:'group'
})
@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {

  tab1Root = 'pintuan';
  tab2Root = 'rank';
  tab3Root = 'collage';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupPage');
  }

}
