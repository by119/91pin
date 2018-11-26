import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll, Content } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";


@IonicPage({
  name: 'order'
})
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  @ViewChild(Content) content: Content;
  tabs: any = "0"; items = [[], [], [], []]; page = [0, 0, 0, 0];
  res = [];
  params: any = {};
  infiniteScrollState = [!0, !0, !0, !0];
  orderState: boolean = false; //我的拼购弹框
  orderNeedLoad = [!0,!0,!0,!0];
  listArr = []; //订单
  assessArr = []; //评价
  pet: any = '-1'; //当前所在tab列 全部订单：-1   待付款：0  待收货：2 待评价：3
  size = 10; //一次请求数据条数
  // page = 1; //当前请求的页数
  objectId = null;
  delSate = !1;


  constructor(
    public navCtrl: NavController,
    public cp: CommonProvider,
    public navParams: NavParams) {
    this.pet = this.navParams.get('pet') || '-1';
  }

  ionViewDidLoad() {
    this.cp.checkLogin().then(loaded => {
      if (loaded) {
        this.pet2tab(this.pet);
        // this.tabs != 3 ? this.getList(this.tabs) : this.appraise();
        this.doInfinite();
      }
    })
  }
  pet2tab(p) {
    // 全部订单：-1  待付款：0 待收货：2  待评价：3
    switch (p) {
      case '-1':
        this.tabs = '0'; break;
      case '0':
        this.tabs = '1'; break;
      case '2':
        this.tabs = '2'; break;
      case '3':
        this.tabs = '3'; break;
      default:
        this.tabs = '0'; break;
    }
  }

  changeSeg() {
    this.pet2tab(this.pet);
    if (this.delSate) {
      this.infiniteScrollState[this.tabs] = !0;
      this.page[this.tabs] = 0;
      this.items[this.tabs] = [];
      this.doInfinite();
      this.delSate = !1;
      return false;
    }
    0 == this.page[this.tabs] && this.doInfinite(),
      this.infiniteScroll.enable(this.infiniteScrollState[this.tabs]);
  }

  showOrder() {
    this.orderState = !this.orderState;
  }
  goTo(url) {
    this.cp.goto(url)
  }
  // 待评价
  appraise() {
    this.cp.getData('user/order/appraise', {}).then(
      (t: any) => {
        this.assessArr = t.data;
      }
    )
  }
  // 取消订单
  cancel(i) {
    this.cp.getData('user/order/cancel', {
      id: this.objectId
    }).then(
      (t: any) => {
        if (t.code == 0) {
          this.cp.toast('取消成功');
          this.items[this.tabs].splice(i,1);

          this.orderNeedLoad[0] = !0;
          // this.delSate = !0;
          // this.infiniteScrollState[this.tabs] = !0;
          // this.page[this.tabs] = 0;
          // this.items[this.tabs] = [];
          // this.doInfinite();
        } else {
          this.cp.toast(t.data);
        }
      }
    )
  }
  confirmCancel(objectId,i) {
    this.objectId = objectId;
    this.cp.prompt(
      '提示', '确认取消订单？', '取消', () => { }, '确定', () => {
        this.cancel(i);
      });
  }

  doInfinite() {
    if (this.tabs == 3) {
      this.cp.getData("user/order/appraise", {}).then((e: any) => {
        if (e.data.length > 0) {
          this.res[this.tabs] = e;
          this.items[this.tabs] = this.items[this.tabs].concat(this.res[this.tabs].data);
          this.infiniteScroll.complete();
        } else {
          this.infiniteScrollState[this.tabs] = !1;
          this.infiniteScroll.enable(this.infiniteScrollState[this.tabs]);
        }
      })
    } else {
      this.params = {
        page: ++this.page[this.tabs],
        size: this.size,
        status: this.pet,
        type: "0",
      }
      this.params.silent = this.params.page > 1;
      this.cp.getData("user/order/list", this.params).then((e: any) => {
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

  // 确认收货
  confirmOrder(i) {
    let that = this;
    this.cp.prompt(
      '提示', '确认收到商品?', '取消', function () {
        // console.log('取消');
      }, '确定', function () {
        that.cp.getData("user/order/confirm", { id: that.objectId }).then((res: any) => {
          if (res.code == 0) {
            that.cp.toast('确定完成');
            this.items[this.tabs].splice(i,1);
            // that.delSate = !0;
            // that.infiniteScrollState[that.tabs] = !0;
            // that.page[that.tabs] = 0;
            // that.items[that.tabs] = [];
            // that.doInfinite();
          } else {
            that.cp.toast(res.data);
          }
        })
      });
  }
}
