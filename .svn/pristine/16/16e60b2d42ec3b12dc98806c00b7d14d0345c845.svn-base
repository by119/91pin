import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll, Content } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";

@IonicPage({
  name: 'channel'
})
@Component({
  selector: 'page-channel',
  templateUrl: 'channel.html',
})
export class ChannelPage {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  @ViewChild(Content) content: Content;
  tabs = "0";//当前所在tab列  默认：0   销量：1  价格：2
  items = [[], [], []];
  page = [0, 0, 0];
  res = []; params: any = {}; infiniteScrollState = [!0, !0, !0];
  size = 30;//一次请求数据条数
  title = "加载中";
  tc_id: string = "";
  keyword: string = "1";
  sort_key: any = "0";
  sort_values: any = ["DESC", "DESC", "DESC"];
  goods: any = []
  constructor(public navCtrl: NavController,
    public cp: CommonProvider,
    public navParams: NavParams) {
    this.title = this.navParams.data.title;
    this.tc_id = this.navParams.data.tc_id;
    if (!this.tc_id)
      this.navCtrl.pop();
    else
      this.page[this.tabs] == 0 && this.doInfinite();
  }
  changeSeg() {
    0 == this.page[this.tabs] && this.doInfinite();
    this.infiniteScroll.enable(this.infiniteScrollState[this.tabs]);
  }
  changeSort() {
    if (this.tabs != this.sort_key||this.tabs=='0') {
      this.sort_key = this.tabs;
    } else {
      this.sort_values[this.tabs] = this.sort_values[this.tabs] == 'DESC' ? 'ASC' : 'DESC';
      this.page[this.tabs] = 0;
      this.items[this.tabs]=[];
      this.infiniteScrollState[this.tabs]=!0;
      this.doInfinite();
      this.infiniteScroll.enable(this.infiniteScrollState[this.tabs]);
    }
  }
  doInfinite() {
    this.params = {
      page: ++this.page[this.tabs],
      size: this.size,
      type: this.tabs,
      keyword: this.keyword,
      sort_key: this.sort_key,
      sort_value: this.sort_values[this.tabs],
      tc_id: this.tc_id
    }
    this.cp.getData("team/categoryList", this.params).then((e: any) => {
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
