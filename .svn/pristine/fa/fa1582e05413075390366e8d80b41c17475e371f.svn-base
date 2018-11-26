import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll, Content } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";

/**
 * Generated class for the RankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'rank'
})
@Component({
  selector: 'page-rank',
  templateUrl: 'rank.html',
})

export class RankPage {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  @ViewChild(Content) content: Content;
  tabs = "0";//当前所在tab列 热门：0   新品：1  优选：2
  items = [[], [], []]; page = [0, 0, 0]; res = []; params: any = {}; infiniteScrollState = [!0, !0, !0];
  size = 10;//一次请求数据条数
  constructor(public navCtrl: NavController,
    public cp: CommonProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.page[this.tabs] == 0 && this.doInfinite()
  }

  goTo(url) {
    this.cp.goto(url);
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
    }
    
    this.cp.getData("team/teamRanking", this.params).then((e: any) => {
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
