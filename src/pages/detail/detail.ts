import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavParams, Content, ViewController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { WechatApi } from '../../providers/common/wechatApi';

//declare var openAppTipInformed : any;
declare var GetAjaxRequest: any;

@IonicPage({
  name: 'detail',
  segment: 'detail/:up',
  defaultHistory: ['welcome']
})
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  @ViewChild(Content) content: Content;

  params: any = {}; item: any = { pic: "./assets/imgs/loading.jpg" }; addFootprint = !1; /*iframeSrc;*/minimized = false; shareBtn = "./assets/imgs/share_trans_white.png";/*shareMode=!1;*/couponIndex = 0; timestamp; init; share_text;

  constructor(public navParams: NavParams, public viewCtrl: ViewController, public cp: CommonProvider, public api:WechatApi) {
    this.timestamp = new Date().getTime() / 1000;

    var _ = this.navParams.get("up");
    /*this.cp.plt.is("cordova") || (this.cp.plt.is("ios") && 0 == openAppTipInformed ? (openAppTipInformed = 1, window.location.href = "shengqianbao://?params=" + _, this.cp.toast("客户端使用更便捷咯")) : this.iframeSrc = this.cp.sanitizer.bypassSecurityTrustResourceUrl("shengqianbao://?params=" + _ + "&t=" + (new Date).getTime())),*/
    this.params = JSON.parse(_);
    if (this.params.link)
      this.params.iid = this.params.link.split("=")[1];

    this.params.DGAPI = 1;
    if (!this.params.iid)
      this.cp.pop()
    else if (this.item = this.params, this.item.pic && (this.item.pic = this.cp.getPurePic(this.item.pic)), (this.params.id && new Date().getTime() / 1000 - this.params.update_time < 86400 * 3) || this.params.coupon_activity_id) { //没券的每3天重新获取一次 有券的超3天页面会有提示 有刷新数据按钮
      //转义从浏览记录传递进来的字符串
      this.item.coupon_amount = parseInt(this.item.coupon_amount);
      this.item.coupon_price = parseFloat(this.item.coupon_price);
      if (this.item.coupon_amount) {
        if (this.timestamp - this.params.update_time > 86400 * 3) {
          if (this.item.update_time) {
            let date = new Date(this.item.update_time * 1000);
            this.item.update_time_text = (date.getMonth() + 1) + "-" + date.getDate();
          }
        } else
          this.item.update_time_text = '';
      }
      // this.params.just_tkl = 1; // 2018.11.4注释 提到外面去，不管是不是近3天内的都直接获取淘口令
    }
    this.params.just_tkl = 1; // 2018.11.4 新增
  }

  handleScroll() {
    let rgba = 0.5, //按钮 默认的背景色为0.5  最终要归为0
      opacity = 1, //按钮 默认总透明度为1 需要变为0 在变为1
      title_rgba = 1, //标题 文字颜色 0 - 1
      navbar_rgba = 1, //导航栏 背景色 0 - 1
      navbar_border_rgba = 0.3,
      ele = this.viewCtrl.pageRef().nativeElement,
      h = ele.querySelector(".pict").offsetHeight,
      rgba_shift = rgba / h,
      opacity_shift = opacity / h * 2,
      title_rgba_shift = title_rgba / h,
      navbar_rgba_shift = navbar_rgba / h,
      navbar_border_rgba_shift = navbar_border_rgba / h,
      show = !0,
      changed = !1;

    this.content.ionScroll.subscribe(scroll => {
      var t = scroll.scrollTop;
      if (t > h) {
        if (changed)
          return;
        else {
          changed = !0;
          t = h;
        }
      } else
        changed = !1;

      if (t > 0 && show) {
        show = !1;
      } else if (t === 0) {
        show = !0;
        ele.querySelector(".overlay").setAttribute('style', "");
        ele.querySelector(".back-button").setAttribute('style', "");
        ele.querySelector(".toolbar-title").setAttribute('style', "");
        ele.querySelector(".toolbar-background").setAttribute('style', "");
        this.shareBtn = "./assets/imgs/share_trans_white.png";
        ele.querySelector(".overlay img").src = this.shareBtn;
        return;
      }

      if (t > h / 2) {
        //直接采用绑定的方式 页面不点击一下 不会变所以采用直接修改dom的
        if (this.shareBtn != "./assets/imgs/share_trans_black.png") {
          this.shareBtn = "./assets/imgs/share_trans_black.png";
          ele.querySelector(".overlay img").src = this.shareBtn;
        }
        ele.querySelector(".back-button").setAttribute('style', "background-color:rgba(0,0,0," + (rgba - t * rgba_shift) + ");opacity:" + Math.abs(opacity - t * opacity_shift) + ";color:black");
      } else {
        if (this.shareBtn != "./assets/imgs/share_trans_white.png") {
          this.shareBtn = "./assets/imgs/share_trans_white.png";
          ele.querySelector(".overlay img").src = this.shareBtn;
        }
        ele.querySelector(".back-button").setAttribute('style', "background-color:rgba(0,0,0," + (rgba - t * rgba_shift) + ");opacity:" + Math.abs(opacity - t * opacity_shift));
      }
      ele.querySelector(".overlay").setAttribute('style', "background-color:rgba(0,0,0," + (rgba - t * rgba_shift) + ");opacity:" + Math.abs(opacity - t * opacity_shift));
      ele.querySelector(".toolbar-title").setAttribute('style', "color:rgba(0,0,0," + (t * title_rgba_shift) + ")");
      ele.querySelector(".toolbar-background").setAttribute('style', "background-color:rgba(255,255,255," + (t * navbar_rgba_shift) + "); border-color: rgba(0,0,0," + (t * navbar_border_rgba_shift) + ")");
    });
  }

  ionViewWillEnter() {
    this.cp.init().then(() => {
      this.item.tkl ? (this.footprint(), this.handleItem()) : this.detail()
      this.viewCtrl.setBackButtonText("");
    })
  }

  ionViewDidEnter() {
    if (this.cp.plt.is('cordova'))
      this.cp.styleDefault();

    this.init = 1;
  }

  sel(index) {
    this.params.coupon_activity_id = this.item.coupons[index].activityId,
      this.item.coupon_amount = this.item.coupons[index].amount,
      this.item.coupon_info = this.item.coupons[index].couponInfo;
    if (this.item.coupon_amount && this.item.zk_price >= this.item.coupons[index].man) {
      this.item.coupon_price = this.item.zk_price - this.item.coupon_amount;
      this.item.now_price = this.item.coupon_price;
    } else {
      this.item.coupon_price = 0;
      this.item.now_price = this.item.zk_price;
    }
    // this.item.vip_price = this.item.now_price - this.item.max_comm_fee;
    this.couponIndex = index;
    if (this.item.coupons[index].tkl) {
      this.item.tkl = this.item.coupons[index].tkl;
      this.cp.getShareText(this.item, '<br/>').then((res: any) => {
        this.share_text = res;
      })
    } else {
      this.params.dx = this.item.dx,
        this.params.market = this.item.market,
        this.params.title = this.item.title,
        this.params.tk_rate = this.item.tk_rate,
        this.params.event_rate = this.item.event_rate,
        this.params.dx_rate = this.item.dx_rate,
        this.params.coupon_index = this.couponIndex,
        this.params.coupons = this.item.coupons,
        this.params.just_tkl = 1,
        this.detail()
    }
  }
  doNotUseCoupon() {
    this.params = this.item, this.params.just_tkl = 1, this.params.coupon_activity_id = '', this.item.coupon_price = 0, this.item.coupon_amount = 0, this.item.coupon_info = '', this.detail(1)
  }
  handleItem() {
    if (this.cp.u.pullnew && !this.cp.u.pullnew.status) {
      this.item.now_rate = this.item.tk_common_rate;
    }
    this.item.max_comm_fee = this.item.max_rate * this.item.now_price / 100, this.item.now_comm_fee = this.item.now_rate * this.item.now_price / 100,/* this.item.vip_price = this.item.vip_price ? this.item.vip_price : this.item.now_price - this.item.max_comm_fee,*/ this.item.coupon_left_count = 0, this.item.coupon_total_count = 0;
    if (this.item.coupon_amount)
      this.item.coupons && (this.item.coupons[this.couponIndex].tkl = this.item.tkl);
    else
      this.item.coupons && (
        //不用券的时候就没coupon_amount 这时候coupon_activity_id也就不赋值
        this.item.coupon_amount && (
          this.params.coupon_activity_id = this.item.coupons[this.couponIndex].activityId
        ),
        this.params.dx = this.item.dx,
        this.params.market = this.item.market,
        this.params.title = this.item.title,
        this.params.tk_rate = this.item.tk_rate,
        this.params.event_rate = this.item.event_rate,
        this.params.dx_rate = this.item.dx_rate,
        this.params.coupon_index = this.couponIndex,
        this.params.coupons = this.item.coupons,
        this.params.just_tkl = 1
      );

    this.cp.getShareText(this.item, '<br/>').then((res: any) => {
      this.share_text = res;
    })

       if(this.cp.isWechat()){
         let timer = setInterval(()=>{this.init && (clearInterval(timer), this.api.register(this.shareConfig(1)))},200)
       }
  }
  detail(apply = 0) {
    return new Promise((resolve, reject) => {
      this.params.apply = apply,
        this.cp.getData("product/detail", this.params).then((n: any) => {
          if (n.status) {
            let timer;
            this.handleScroll(),
              this.item.iid = this.params.iid,
              Object.assign(this.item, n.data),
              this.handleItem();

            if (n.data.code_url && this.cp.plt.is('cordova')) {
              this.cp.getShareText(this.item, '<br/>').then((res: any) => {
                this.share_text = res;
              })
              GetAjaxRequest.setCookie(n.data.cookie,'https://pub.alimama.com',()=>{
                this.cp.plt.is('ios') && GetAjaxRequest.get("mtop.alimama.union.hsf.coupon.get", (res) => {
                  GetAjaxRequest.clear(), res = "{" + res.split("({")[1].replace("})", "}"), res = JSON.parse(res);
                  if (res && res.data && res.data.success) {
                    this.cp.getData("product/tkl", { url: 'http:' + res.data.result.item.shareUrl, title: this.item.title, silent: 1, DGAPI:1 }).then((r: any) => {
                      if (r.status) {
                        this.item.code_url = '';
                        this.item.tkl = r.msg;
                        this.cp.getShareText(this.item, '<br/>').then((res: any) => {
                          this.share_text = res;
                        })
                      } else
                        this.cp.toast('获取淘口令失败，请联系客服'), clearInterval(timer), this.cp.pop();
                    })
                  } else
                    this.cp.toast('获取淘口令失败，请稍后再试'), clearInterval(timer), this.cp.pop();
                });
                //只有android的时候 会进入then
                this.cp.openBrowser(n.data.code_url, { title: { staticText: "淘口令获取" }, hidden: true }).then(res => {
                  this.cp.getData("product/tkl", { url: res, title: this.item.title, silent: 1,DGAPI:1 }).then((r: any) => {
                    if (r.status) {
                      this.item.code_url = '';
                      this.item.tkl = r.msg;
                      this.cp.getShareText(this.item, '<br/>').then((res: any) => {
                        this.share_text = res;
                      })
                    } else
                      this.cp.toast('获取淘口令失败，请稍后再试'), clearInterval(timer), this.cp.pop();
                  })
                }, err => {
                  this.cp.toast('获取淘口令失败，请稍后再试'), clearInterval(timer), this.cp.pop();
                });
              })
            } else if (!n.data.tkl && n.data.code != 1 && n.data.code != 2 && n.data.code != 4)
              return this.cp.toast('获取淘口令失败，请联系客服'), this.cp.pop();
            else {
              this.cp.getShareText(this.item, '<br/>').then((res: any) => {
                this.share_text = res;
              })
              resolve();
            }
          }
          else if (0 === n.msg.indexOf("http"))
            if (this.cp.plt.is("cordova")) {
              GetAjaxRequest.setCookie(this.cp.u.cookie, 'https://pub.alimama.com', () => {
                this.browser(n.msg, resolve)
              })
            } else
              this.cp.toast("访问的人太多，获取数据失败咯/(ㄒoㄒ)/~~；下载App，快人一等！"), this.cp.pop();

          else this.cp.toast(n.msg), this.cp.pop();

          if (n.status)
            this.footprint()
        })
    })
  }
  browser(url, resolve) {
    this.cp.openBrowser(url, { title: { staticText: "请输入验证码" } }).then((n: any) => {
      if (n.type == 'dx')
        this.params.dxData = n.data, this.cp.toast("正在为您生成专属口令")
      else if (n.type == 'dx2')
        this.params.dx_just_applyed = 1
      else if (n.type == 'tkl')
        this.params.tklData = n.data, this.cp.toast("验证成功，正在重新加载"), this.params.coupon_activity_id = ''

      this.detail(1).then(() => {
        resolve()
      })
    }, err => { err == 'setAutoLogin' || this.cp.pop() })
  }
  footprint() {
    if (!this.addFootprint) {
      this.addFootprint = !0;
      var r = Object.assign({DGAPI:1}, this.item);
      delete r.tkl;
      delete r.dx;
      delete r.just_tkl;
      delete r.auto_buy;
      delete r.pocket_id;
      r.money_saved = r.max_comm_fee - 0 + (r.coupon_amount ? r.coupon_amount - 0 : 0),
        r.silent = 1,
        this.cp.getData("footprint/add", r)
    }
  }
  refresh() {
    this.params.just_tkl = 0, this.params.coupon_activity_id = '', this.item.update_time_text = '', this.detail()
  }

  copy(msg = '') {
    return this.cp.goto({ view: 'copy', text: this.share_text.replace(/<br\/>/g,'\r\n'), download: 1, suc: msg }),
      this.cp.temp.copySupported
  }
  shareConfig(wechat=0){
    let msg = this.share_text.replace(/<br\/>/g,'\r\n'), t;
    if(wechat){
      msg = msg.split(/\r?\n/);
      t = {
        message : msg[2] + " " + msg[3],
        title : msg[1] + " " + msg[0],
        pic : this.item.pic,
        url : this.cp.getShareUrl("#/detail/" + JSON.stringify(this.item))
      }
    }else{
      t = {
        message: msg + ' 更多超值券：',
        // pic: this.cp.getSharePic('product','',this.item),
        pic: this.item.pic,
        url: this.cp.getShareUrl("#/detail/" + JSON.stringify(this.item))
      }
    }
    return t;
  }
  share() {
    if(this.cp.isWechat()){
      this.cp.toast("请点击右上角 ··· 进行分享");
    }else if(this.cp.plt.is("cordova")){
      this.copy('分享文字已复制') && this.cp.share(this.shareConfig())
    }else
      this.cp.goto({view:"download"})
  }
  open() {
    if (this.item.code_url)
      this.cp.plt.is('cordova') ? this.cp.toast('正在获取淘口令') : this.cp.goto({ view: 'download', msg: "口令获取失败，请到App内获取" });
    else if (this.copy()) {
      if (this.cp.plt.is("cordova")) {
        if (this.item.code == 2)
          return this.cp.toast('正在生成专属口令') && this.detail(1).then(() => { this.open() });
      } else {
        this.cp.toast("淘口令已复制，请打开手机淘宝下单")
      }

      this.cp.openTaobao()
    }
  }

  minimize() {
    this.minimized = true;
  }
}
