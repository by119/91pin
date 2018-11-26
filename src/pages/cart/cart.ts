import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";

@IonicPage({
  name: 'cart',
  priority: 'off'
})
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  bestGoods = [];
  cartList = [];
  total = [];
  teamId = 0; //拼团队伍id
  tId = 0;//goodinfoid
  flowType = null; //
  temp = {}; //跳转页面所带参数
  cartId = null;
  cartIdList = [];
  cartIdStr = '';
  goodsIdList = [];
  goodsIdStr = '';
  allState = false; //商品是否全部选中
  shopList = []; //店铺选中状态
  editState = false; //商品可否编辑状态
  chooseNum = [];//已选数量
  // goodNum = [];//库存数量
  // astrictNum = 1; //限购数量
  bigNum = [];//最大购买数量
  // shopGoodsId = [];
  shopGoodsIdStr = ''; //选择的商店下的商品id
  totalPrice = '￥0';
  totalNum = 0;
  constructor(public navCtrl: NavController,
    public cp: CommonProvider) {
  }
  
  ionViewWillEnter() {
    // 因为实际还没enter 当前被选中的tab还没更新 所以下面的语句实际选中的就是上一个tab
    // 用this.navCtrl.parent.previousTab()反而不准
    let previousTab = this.navCtrl.parent.getSelected();
    this.cp.checkLogin(0).then(loaded=>{
      if(loaded)
        this.cart();
      else{
        setTimeout(()=>{
          this.navCtrl.parent.select(previousTab)
        }, 500);
      }
    });
  }
  gotoHome() {
    this.cp.gotoRoot();
    this.navCtrl.parent.select(0)
  }
  goTo(url) {
    this.cp.goto(url)
  }
  // 编辑
  showEdit() {
    this.editState = !this.editState;
  }
  // 减少数量
  reduce(i, j, id) {
    if (this.chooseNum[i][j] > 1) {
      this.chooseNum[i][j]--;
      this.changeNum(i, j, this.chooseNum[i][j], id);
    }
  }
  // 添加数量
  add(i, j, id) {
    this.chooseNum[i][j]++;
    this.changeNum(i, j, this.chooseNum[i][j], id);
  }
  inputKeyUp(num, e) {
    e.target.value = e.target.value.replace(/[^\d]/g, '');
    e.target.value = Math.floor(e.target.value);
    e.target.value = e.target.value <= 0 ? 1 : e.target.value;
    num = e.target.value;
    num = num <= 0 ? 1 : num;

  }
  inputBlur(num, i, j, id) {
    this.changeNum(i, j, num, id);
  }
  // 购物车
  cart() {
    this.cp.getData('cart', {}).then(
      (t: any) => {
        this.bestGoods = t.data.best_goods;
        this.cartList = t.data.cart_list;
        this.total = t.data.total;
        let cart_list = t.data.cart_list, cartArr = [], idList = [], goodsIdList = [], bigNumList = [], chooseNumList = [], shopList = [];
        for (let i in cart_list) {
          let o = {};
          o[i] = cart_list[i];
          for (const key in o) {
            let list = o[key];
            let id = [], goodsId = [], bigNum = [], num = [], newGoods = [];
            let newList = list.new_list[0].act_goods_list;
            for (const li in newList) {
              newGoods.push(newList[li]);
              id.push(null);
              goodsId.push(null);
              bigNum.push(0);//----------------
              num.push(newList[li].goods_number);
            }
            list.new_list = newGoods;
            cartArr.push(list);
            idList.push(id);
            goodsIdList.push(goodsId);
            bigNumList.push(bigNum);
            chooseNumList.push(num);
            shopList.push(0);
          }
        }
        this.cartIdList = idList;
        this.goodsIdList = goodsIdList;
        this.bigNum = bigNumList;
        this.chooseNum = chooseNumList;
        this.shopList = shopList;
        this.cartList = cartArr;
      }
    )
  }
  // 全选
  chooseAll() {
    this.allState = !this.allState;
    for (var i = 0; i < this.cartIdList.length; i++) {
      this.shopList[i] = this.allState;
      for (let j = 0; j < this.cartIdList[i].length; j++) {
        this.cartIdList[i][j] = this.allState == true ? this.cartList[i].new_list[j].rec_id : null;
        this.goodsIdList[i][j] = this.allState == true ? this.cartList[i].new_list[j].goods_id : null;
      }
    }
  }
  // 选择商店
  chooseShop(i) {
    let shopGoodsId = [];
    this.shopList[i] = !this.shopList[i];
    for (let j = 0; j < this.cartIdList[i].length; j++) {
      this.cartIdList[i][j] = this.shopList[i] == true ? this.cartList[i].new_list[j].rec_id : null;
      this.goodsIdList[i][j] = this.shopList[i] == true ? this.cartList[i].new_list[j].goods_id : null;
      shopGoodsId[shopGoodsId.length] = this.cartList[i].new_list[j].rec_id;
    }
    this.shopGoodsIdStr = shopGoodsId.join(',');
    this.all();
    this.reckonCatNum({
      cart_id: this.shopGoodsIdStr,
      status: this.shopList[i] ? 1 : 0
    });
  }
  // 选择商品
  chooseGoods(i, j, cartid, goodsId) {
    this.cartIdList[i][j] = this.cartIdList[i][j] != null ? null : cartid;
    this.goodsIdList[i][j] = this.goodsIdList[i][j] != null ? null : goodsId;
    this.all();
    this.reckonCatNum({
      cart_id: JSON.stringify(cartid),
      status: ''
    });
  }
  all() {
    // &&this.chooseNum[i][j]<this.bigNum[i][j]
    let count = 0, allCount = 0;
    for (var i = 0; i < this.cartIdList.length; i++) {
      let shopCount = 0;
      allCount += this.cartIdList[i].length;
      for (let j = 0; j < this.cartIdList[i].length; j++) {
        if(this.chooseNum[i][j]<=0){
          this.cartIdList[i][j]=null;
        }
        if (this.cartIdList[i][j] != null) {
          count++;
          shopCount++;
        }
      }
      this.shopList[i] = shopCount >= this.cartIdList[i].length ? true : false;
    }
    this.allState = count >= allCount ? true : false;
  }
  // 个人地址信息-提交订单
  addressList() {
    this.cartIdFn();
    if (this.cartIdStr == '') {
      this.cp.toast('请先选择商品！');
      return false;
    }
    this.cp.getData('user/address/list', {
      silent: true
    }).then(
      (t: any) => {
        if (t.data !== '') {
          //去确认订单页面
          // ?objectId=0&flow_type=" + a + "&team_id=" + r + "&t_id=" + o
          this.temp = {
            view: 'firm-order',
            cartId: this.cartIdStr,
            objectId: 0,
            flow_type: this.flowType,
            team_id: this.teamId,
            t_id: this.tId
          };
          this.goTo(this.temp);//跳转至订单详情页面
        } else {
          // 去添加地址页面
        }
      }
    )
  }
  // 修改商品数量
  changeNum(i, j, amount, id) {
    let temp: any = {
      id: id,
      number: amount
    };
    temp.H5API = true;
    temp.silent = true;
    temp.act_id = NaN;
    temp.arr = this.cartIdStr ? this.cartIdStr + ',' : id + ',';
    temp.none = this.cartIdList[i][j] ? 0 : 1;

    this.cp.getData('?m=cart&a=cart_goods_number', temp).then(
      (t: any) => {
        if (this.cartIdStr.indexOf(id) != -1) {
          this.totalNum = t.num;
          this.totalPrice = t.content;
        }
        this.bigNum[i][j] = t.num;
        this.chooseNum[i][j] = amount <= this.bigNum[i][j] ? amount : this.bigNum[i][j];
        if (t.msg) {
          this.cp.toast(t.msg);
          this.cartIdList[i][j]=null;
        }
      }
    )
  }
  // 延迟执行
  debounce(idle, action) {
    console.log(11)
    var last;
    return function () {
      console.log(22);
      var ctx = this, args = arguments;
      clearTimeout(last);
      last = setTimeout(function () {
        console.log(33);
        action.apply(ctx, args);
      }, idle)
    }
  }

  // 删除商品确认框
  confirmDelete(i, j, id, goodsId) {
    let that = this;
    this.cp.prompt(
      '提示', '确认删除选中商品？', '取消', function () {
        // console.log('取消');
      }, '确定', function () {
        that.delete(i, j, id, goodsId);
        // let count = 0;
        // for (var i = that.cartIdList.length - 1; i >= 0; i--) {
        //   for (var j = that.cartIdList[i].length - 1; j >= 0; j--) {
        //     if (that.cartIdList[i][j] != null) {
        //       count++;
        //       that.delete(i,j,that.cartIdList[i][j]);
        //     }
        //   }
        // }
        // if (count <= 0) {
        //   that.cp.toast('请先选择要删除的商品!');
        // }
      });
  }
  // 删除商品
  delete(i, j, id, goodsId) {
    this.cp.getData('cart/delete', {
      id: id,
      silent: true
    }).then(
      (t: any) => {
        if (this.cartIdList[i][j] != null) {
          this.reckonCatNum({
            cart_id: JSON.stringify(this.cartIdList[i][j]),
            status: ''
          });
        }
        this.cartList[i].new_list.splice(j, 1);
        this.cartIdList[i].splice(j, 1);
        this.chooseNum[i].splice(j, 1);
        this.bigNum[i].splice(j, 1);
        if (this.cartList[i].new_list.length <= 0) {
          this.shopList.splice(i, 1);
          this.cartList.splice(i, 1);
          this.cartIdList.splice(i, 1);
          this.chooseNum.splice(i, 1);
          this.bigNum.splice(i, 1);
        }
        this.cp.toast('删除成功!');

      }, err => {
        this.cp.toast('删除失败，请重试');
      }
    )
  }
  // 点击选择时统计购物车合计价格和商品数量
  reckonCatNum(temp) {
    this.cartIdFn();
    temp.H5API = true;
    temp.silent = true;
    temp.id = this.cartIdStr + ',';
    this.cp.getData('?m=cart&a=cart_label_count', temp).then(
      (t: any) => {
        this.totalNum = t.cart_number;
        this.totalPrice = t.content;
      }
    )
  }
  cartIdFn() {
    let cartIdStr = [];
    for (var i = 0; i < this.cartIdList.length; i++) {
      for (let j = 0; j < this.cartIdList[i].length; j++) {
        if (this.cartIdList[i][j] != null) {
          cartIdStr.push(this.cartIdList[i][j]);
        }
      }
    }
    this.cartIdStr = cartIdStr.join(',');
  }
  goodsIdFn() {
    let goodsIdStr = [];
    for (var i = 0; i < this.goodsIdList.length; i++) {
      for (let j = 0; j < this.goodsIdList[i].length; j++) {
        if (this.goodsIdList[i][j] != null) {
          goodsIdStr.push(this.goodsIdList[i][j]);
        }
      }
    }
    this.goodsIdStr = goodsIdStr.join(',');
  }
}
