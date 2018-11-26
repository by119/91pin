import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, InfiniteScroll, Content } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";

/**
 * Generated class for the CollagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'collage'
})
@Component({
  selector: 'page-collage',
  templateUrl: 'collage.html',
})
export class CollagePage {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  @ViewChild(Content) content: Content;
  tabs = "0"; items = [[], [], []]; page = [0, 0, 0]; res = []; params: any = {}; infiniteScrollState = [!0, !0, !0];
  size = 10;//一次请求数据条数
  constructor(
    public navCtrl: NavController,
    public cp: CommonProvider) {
  }

  ionViewWillEnter() {
    // 因为实际还没enter 当前被选中的tab还没更新 所以下面的语句实际选中的就是上一个tab
    // 用this.navCtrl.parent.previousTab()反而不准
    let previousTab = this.navCtrl.parent.getSelected();
    this.cp.checkLogin(0).then(loaded=>{
      if(loaded)
        this.page[this.tabs] == 0 && this.doInfinite()
      else{
        setTimeout(()=>{
          this.navCtrl.parent.select(previousTab)
        }, 500);
      }
    });
  }
  goTo(url) {
    this.cp.goto(url)
  }
  changeSeg() {
    this.params.status = parseInt(this.tabs) - 1,
      0 == this.page[this.tabs] && this.doInfinite(),
      this.infiniteScroll.enable(this.infiniteScrollState[this.tabs])
  }

  doInfinite() {
    this.params = {
      page: ++this.page[this.tabs],
      size: this.size,
      type: this.tabs
    };
    this.cp.getData("team/teamUserOrder", this.params).then((e: any) => {
      if (e.data.length > 0) {
        this.res[this.tabs] = e;
        this.items[this.tabs] = this.items[this.tabs].concat(this.res[this.tabs].data);
        this.infiniteScroll.complete();
      } else {
        this.infiniteScrollState[this.tabs] = !1;
        this.infiniteScroll.enable(this.infiniteScrollState[this.tabs]);
      }
    })
  }
}