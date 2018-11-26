import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';

@IonicPage({
  priority: 'off',
  name : "share"
})
@Component({
  selector: 'page-share',
  templateUrl: 'share.html',
})
export class SharePage {
  showSave = !0;

  constructor(public viewCtrl: ViewController, public navParams: NavParams, public cp: CommonProvider) {
    if(this.navParams.get("hideSave"))
      this.showSave = !1;
  }
 
  shareTo(t){
    if(this.cp.shareTo(t))
      this.closeShare()
  }

  closeShare() {
      this.viewCtrl.dismiss()
  }
}
