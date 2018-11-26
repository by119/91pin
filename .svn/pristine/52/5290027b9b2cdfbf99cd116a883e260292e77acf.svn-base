import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";

/**
 * Generated class for the CollectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'collect'
})
@Component({
  selector: 'page-collect',
  templateUrl: 'collect.html',
})
export class CollectPage {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  size = 10; //一次请求数据条数
  page = 0; //当前请求的页数
  items = [];
  res: any = [];
  params: any = {};
  constructor(public navCtrl: NavController,
    public cp: CommonProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.doInfinite()
  }
  goTo(url) {
    this.cp.goto(url)
  }
  delete(id,i) {
    this.cp.getData('user/collect/add', {
      id: id
    }).then(
      (t: any) => {
        if (t.code == 0) {
          this.items.splice(i,1);
        }
      }
    )
  }

  doInfinite() {
    this.params = {
      page: ++this.page,
      size: this.size,
    }
    this.cp.getData("user/collectgoods", this.params).then((e: any) => {
      if (e.data.length > 0) {
        this.res = e;
        this.items = this.items.concat(this.res.data);
        this.infiniteScroll.complete();
      } else {
        this.infiniteScroll.enable(false);
      }
    })
  }
}
