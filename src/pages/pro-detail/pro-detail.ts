import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";
import { WechatApi } from '../../providers/common/wechatApi';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage({
  name: 'pro-detail'
})
@Component({
  selector: 'page-pro-detail',
  templateUrl: 'pro-detail.html',
})
export class ProDetailPage {
  @ViewChild(Slides) slides: Slides;
  goods_id = null;
  isCollect = false;
  current: number = 1; //当前所在轮播图
  slideLen: number = 1;  //轮播图数量
  openCoupon: boolean = true; //优惠券列表开关 默认隐藏
  openNum: boolean = false; //数量选择开关 默认显示
  chooseNum: number = 1;//已选数量
  bigNum = 1;//最大购买数量
  grey: boolean = true; // 减数量的按钮是否置灰
  grey2: boolean = false; // 加数量的按钮是否置灰
  pet: string = "0"; // 默认选中商品描述
  goodsCont:any = {};
  stock = 0;
  newLen = 0;
  parameteCont = [];
  // 购买商品 参数选项
  goodsParam = [];//商品属性
  attr_id = [];//选择的商品参数
  attr_label = [];//选择的商品参数文字
  attr_str = ''; //选择的商品参数字符串
  chooseAttr = []; //选择的商品参数名
  chooseAttrIndex = []; //选择的商品参数index
  flowNum = 0;//购物车上角标数量
  temp: any = {};
  cartId = '';
  goods_price='￥0';//当前属性商品价格
  market_price='￥0';//当前属性商品原来价格
  constructor(
    public navCtrl: NavController,
    public cp: CommonProvider,
    public navParams: NavParams,
    public api: WechatApi) {
  }

  ionViewDidLoad() {
    this.goods_id = this.navParams.get('goods_id');
    this.detail();
  }

  goTo(url) {
    this.cp.goto(url);
  }
  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex < this.slideLen) {
      this.current = currentIndex + 1;
    }
  }
  // 控制优惠券显隐
  switchCoupon() {
    this.openCoupon = !this.openCoupon;
  }
  // 控制数量显隐
  switchNum() {
    this.openNum = !this.openNum;
  }

  // 选择商品属性
  choseStyle(name, val, arrIndex, label) {
    this.attr_id[name] = val;
    this.attr_label[name] = label;
    this.chooseAttr[name] = name;
    this.chooseAttrIndex[name] = arrIndex;
    this.attr_str = this.attr_label.join(',');
    this.property();
    // this.buyState == 2 ? this.teamProperty() : this.property();
  }
  inputKeyUp($event) {
    $event.target.value = $event.target.value.replace(/[^\d]/g, '');
    $event.target.value = Math.floor($event.target.value);
    $event.target.value = $event.target.value <= 0 ? 1 : $event.target.value;
    this.chooseNum = $event.target.value <= this.bigNum ? $event.target.value : this.bigNum;
    this.grey = this.chooseNum <= 1 ? true : false;
    this.grey2 = this.chooseNum >= this.bigNum ? true : false;
    this.property();
  }
  // 减少数量
  reduce() {
    if (this.chooseNum > 1) {
      this.chooseNum--;
      this.grey2 = false;
    }
    if (this.chooseNum <= 1) {
      this.grey = true;
    }
    this.property();
  }
  // 添加数量
  add() {
    if (this.chooseNum < this.bigNum) {
      this.chooseNum++;
      this.grey = false;
    }
    if (this.chooseNum >= this.bigNum) {
      this.grey2 = true;
    }
    this.property();
  }
  // 去购物车
  gotoRoot() {
    this.cp.gotoRoot();
    this.navCtrl.parent.select(3)
  }

  // 加入浏览记录
  save() {
    this.cp.getCache('list').then((t: any) => {
      let list: any = t ? t : '';
      if (list == '') {
        this.cp.setCache('list', this.goods_id);
      } else {
        this.cp.getData('goods/save', {
          list: list,
          goodsId: this.goods_id,
          silent: true
        }).then(
          (t: any) => {
            this.cp.setCache('list', t.data);
          }
        )
      }
    });
  }

  // 收藏商品
  switchCollect(id) {
    this.cp.getData('user/collect/add', {
      id: this.goods_id,
      silent: true
    }).then(
      (t: any) => {
        if (t.code == 0) {
          this.isCollect = !this.isCollect;
          if (t.data === 1) {
            this.isCollect = false;
          }
        }
      }
    )
  }
  // 将商品加入购物车
  addCart(state) {
    console.log('将商品加入购物车');
    this.cp.getData('cart/add', {
      id: this.goods_id,
      num: this.chooseNum,
      attr_id: JSON.stringify(this.attr_id),
      silent: true
    }).then(
      (t: any) => {
        this.flowNum = t.data.total_number;
        if (state == 1) {
          this.cp.toast('商品已加入购物车');
        } else {
          this.cartId = t.data.rec_id;
          console.log(this.cartId,'cartId');
          this.addressList();
        }
      }
    )
  }

  // 个人地址信息-提交订单
  addressList() {
    console.log(this.goods_id, 'this.goods_id');
    this.cp.getData('user/address/list', {
      silent: true
    }).then(
      (t: any) => {
        if (t.data !== '') {
          //去确认订单页面
          // ?objectId=0&flow_type=" + a + "&team_id=" + r + "&t_id=" + o
          this.temp = {
            view: 'firm-order',
            cartId: JSON.stringify(this.cartId)
          };
          this.goTo(this.temp);//跳转至订单详情页面
        } else {
          // 去添加地址页面
          this.cp.goto({
            view: 'address'
          });
        }
      }
    )
  }
  // 获取商品详情
  detail() {
    this.cp.getData('goods/detail', {
      id: this.goods_id
    }).then(
      (t: any) => {
        if (t.code == 1) {
          this.cp.toast(t.data.msg);
          this.cp.pop();
          return false;
        }
        this.save();
        this.goodsCont = t.data;
        this.newLen = t.data.recommend.length;
        this.slideLen = t.data.goods_img.length;
        this.isCollect = 1 == t.data.goods_info.is_collect;
        this.flowNum = t.data.cart_number;
        this.goods_price = t.data.goods_info.goods_price;
        this.market_price = t.data.goods_info.market_price_formated;
        
        var pro = t.data.goods_properties.pro, proArr = [];
        for (var i in pro) {
          proArr.push(pro[i]);
          this.chooseAttr[this.chooseAttr.length] = this.chooseAttr.length;
          this.chooseAttrIndex[this.chooseAttrIndex.length] = 0;
          this.attr_id[this.attr_id.length] = pro[i].values[0].id;
          this.attr_label[this.attr_label.length] = pro[i].values[0].label;
        }
        this.attr_str = this.attr_label.join(',');
        this.goodsParam = proArr;
        let spe = t.data.goods_properties.spe, arr = [];
        for (const list in spe) {
          for (const key in spe[list]) {
            arr.push(spe[list][key]);
          }
        }
        this.parameteCont = arr;
        this.property();
      }
    )
  }
  // 修改商品参数
  property() {
    this.cp.getData('goods/property', {
      id: this.goods_id,
      attr_id: this.attr_id,
      num: this.chooseNum,
      warehouse_id: "1",
      area_id: "1",
      // silent: true
    }).then(
      (t: any) => {
        this.stock = t.data.stock;
        this.bigNum = t.data.stock;        
        this.goods_price = t.data.goods_price_formated;
        this.market_price = t.data.market_price_formated;
      }
    )
  }
  // 立即购买
  showBuy() {
    console.log('立即购买');
    this.addCart(0);
  }
  
 
  /*-----------------------分享商品-----------------------*/

  shareConfig(wechat = 0) {
    let msg = this.goodsCont.goods_info.goods_name, t;
    t = {
      message: msg,
      title: msg,
      pic: this.goodsCont.goods_img[0],
      url: this.cp.getShareUrl("#/collage-detail?goods_id=" + this.goods_id)
    }
    return t;
  }
  share() {
    if (this.cp.isWechat()) {
      this.cp.toast("请点击右上角 ··· 进行分享");
    } else if (this.cp.plt.is("cordova")) {
      this.cp.share(this.shareConfig())
    } else
      this.cp.goto({ view: "download" })
  }
}
