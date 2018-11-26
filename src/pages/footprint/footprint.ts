import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll, Content } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";


/**
 * Generated class for the FootprintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'footprint'
})
@Component({
  selector: 'page-footprint',
  templateUrl: 'footprint.html',
})
export class FootprintPage {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  @ViewChild(Content) content: Content;
  @ViewChild("pro") pro;
  size = 10; //一次请求数据条数
  list = ""; //--------------------
  tabs: any = "0"; items: any = [[], []]; page = [0, 0]; res = []; params: any = {}; infiniteScrollState = [!0, !0];
  constructor(public navCtrl: NavController,
    public cp: CommonProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // this.cp.setCache('list','');
    this.cp.getCache('list').then((t: any) => {
      this.list = t ? t : [];
      this.list = this.list.toString();
      this.page[this.tabs] == 0 && this.doInfinite()
    });
  }
  goTo(url) {
    this.cp.goto(url);
  }
  changeSeg() {
    0 == this.page[this.tabs] && this.doInfinite(),
      this.infiniteScroll.enable(this.infiniteScrollState[this.tabs])
  }

  doInfinite() {
    if (this.tabs == 1) {
      this.params = {
        page: ++this.page[this.tabs],
        list: this.list,
        size: this.size
      }
      console.log(this.params, '足迹');
      this.cp.getData("goods/history", this.params).then((e: any) => {
        this.res[this.tabs] = e.data ? e.data.list : [];
        this.items[this.tabs] = this.items[this.tabs].concat(this.res[this.tabs]);
        this.infiniteScroll.complete();
        Math.ceil(e.data.num / this.size) <= this.page[this.tabs] && (this.infiniteScrollState[this.tabs] = !1, this.infiniteScroll.enable(this.infiniteScrollState[this.tabs]));
      })
    } else {
      this.params = {
        p: ++this.page[this.tabs],
        DGAPI: 1,
      }
      this.cp.getData("footprint/getlist", this.params).then((n: any) => {
        n.data.forEach((v) => {
          this.items[this.tabs].push(v.params);
        });
        if (this.cp.settings.share_mode && this.cp.temp.showSlides) {
          this.pro.slideImgs = this.items[this.tabs];
          this.infiniteScroll.complete();
          if (n.per_page * this.params.p > 100) {
            this.cp.toast("最多显示100条记录哦");
            this.infiniteScrollState[this.tabs] = !1;
            this.infiniteScroll.enable(!1);
          } else if (Math.ceil(n.total / n.per_page) <= this.params.p) {
            this.infiniteScrollState[this.tabs] = !1;
            this.infiniteScroll.enable(!1)
          }
        }

      })
    }
  }
}
