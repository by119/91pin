import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions/*,Request,RequestMethod*/ } from '@angular/http';
import 'rxjs/add/operator/map';
import {
  Platform, LoadingController, ToastController, AlertController, PopoverController, ModalController,
  ActionSheetController, App
} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Storage } from '@ionic/storage';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { DomSanitizer } from '@angular/platform-browser';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { AppAvailability } from '@ionic-native/app-availability';
import {SocialSharing} from '@ionic-native/social-sharing';
import { ThemeableBrowser, ThemeableBrowserObject } from '@ionic-native/themeable-browser';
import { Toast } from '@ionic-native/toast';
import * as ClipboardJs from 'clipboard';
import { Clipboard } from '@ionic-native/clipboard';
import { JPush } from "@jiguang-ionic/jpush";

declare var sharesdk: any;
declare var ShareSDK: any;
declare var lyxpay: any;
declare var navigator: any;

@Injectable()
export class CommonProvider {
  WWW_URL = "http://www.maoxuankj.com/m/";
  SITE_URL = "http://www.maoxuankj.com/mobile/";
  BASE_URL = this.SITE_URL + "public/api/wx/";
  H5_BASE_URL = this.SITE_URL + 'index.php';
  DG_BASE_URL = 'http://api.maoxuankj.com/api/';
  DOWNLOAD_URL = "http://a.app.qq.com/o/simple.jsp?pkgname=com.maoxuan.app";
  DOWNLOAD_ANDROID_URL = this.WWW_URL + "mx.apk";
  APP_STORE_ID = "1437475742";
  APP_NAME = "猫选";
  DOWNLOAD_IOS_URL = "https://itunes.apple.com/us/app/" + encodeURIComponent(this.APP_NAME) + "/id" + this.APP_STORE_ID + "?l=zh&ls=1&mt=8";
  SHARE_TEXT = "猫选，您的购物小贴心，只做性价比超高的~";

  u: any = {};
  loadingCount = 0;
  loading;
  settings: any = {};
  initialized = 0;
  logining = 0;
  navCtrl;
  pressed = !1;
  shareOpt;
  global: any = {};
  sharePlatform;
  statusBarColor = 0; // 0 黑 1 白
  temp: any = {checking_update:1};

  browserButtons: any = {
    backButton: {
      wwwImage: 'assets/imgs/back.png',
      wwwImagePressed: 'assets/imgs/back.png',
      wwwImageDensity: 3,
      align: 'left',
    },
    closeButton: {
      wwwImage: 'assets/imgs/close.png',
      wwwImagePressed: 'assets/imgs/close.png',
      wwwImageDensity: 3,
      align: 'left',
    },
    menu: {
      wwwImage: 'assets/imgs/eclipsis.png',
      wwwImagePressed: 'assets/imgs/eclipsis.png',
      wwwImageDensity: 3,
      title: '菜单',
      cancel: '取消',
      align: 'right',
      items: [
          {
              event: 'setAutoLogin',
              label: '设置自动登陆'
          }
      ]
    },
  };
  browser: ThemeableBrowserObject;
  browserOptions: any = {
     toolbar: {
       height: 44,
       color: '#ffffffff'
     },
     title: {
       staticText: this.APP_NAME
     },
     hardwareback : false,
     backButtonCanClose : true,
     hidden : false,
     keyboarddisplayrequiresuseraction: false
  };

  options: StreamingVideoOptions = {
    successCallback: () => {  },
    errorCallback: (e) => { this.toast('播放出错') },
    orientation: 'portrait'
  };

  backButtonSwitch: boolean = true;

  constructor(public http: Http,
    public req: RequestOptions,
    public loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public actionsheetCtrl: ActionSheetController,
    public plt: Platform,
    public appCtrl: App,
    public statusBar: StatusBar,
    public sanitizer: DomSanitizer,
    public clipboard: Clipboard,
    public streamingMedia: StreamingMedia,
    public xToast: Toast,
    public themeableBrowser: ThemeableBrowser,
    public appAvailability: AppAvailability,
    public socialSharing: SocialSharing,
    public photoLibrary: PhotoLibrary,
    public storage: Storage,
    public jpush: JPush,
  ) {
    var t = this.getQueryString("code"), i = this.getQueryString("state");
    if (t && !localStorage.getItem('openid'))
      this.logining = 1,
        this.getData("user/wechatLogin", {
          code: t,
          state: i,
          DGAPI: 1
        }).then((i: any) => {
          i.status ? this.getData("user/login", i.data).then((n:any) => {
              this.handleLogin(n).then(()=>{
                this.logining = 0, localStorage.setItem('openid', i.data.data.openId), this.load()
              })
            }) : 
          this.toast(i.msg), this.load()
        });
    else
      this.load();

    if (plt.is('cordova')) {
        jpush.init();
        jpush.setDebugMode(false);
        var setBadge = (number) => {
          jpush.setApplicationIconBadgeNumber(number);
          jpush.setBadge(number);
        }
        let t = setInterval(() => {
          jpush.getRegistrationID().then(r => {
            try {
              if(r.length > 0){
                setBadge(0), clearInterval(t), t = setInterval(() => {
                  if(this.u.id){
                    clearInterval(t);
                    this.getData("user/pushReg", {
                      id: this.u.id,
                      registrationID: r,
                      platform: this.plt.is("ios") ? 1 : 0,
                      silent : 1,
                      DGAPI: 1
                    })
                  }
                },1000)
              }
            } catch(t) {}
          })
        },
        1e3);
        document.addEventListener("jpush.openNotification",
        (t:any) => {
            this.plt.is("android") ? this.goto(t.extras) : this.goto(t)
        },
        !1)
        document.addEventListener("jpush.receiveNotification",
        (t:any) => {
            var e;
            this.plt.is("android") ? (e = t.extras, e.msg = t.alert) : (e = t, e.msg = t.aps.alert), e.modal ? this.goto(e) : this.promptNotification(e)
        },
        !1)
//          document.addEventListener("jpush.receiveMessage",
//          (t:any) => {
//              var e = t.extras;
//              this.plt.is("android") ? e.msg = t.message: e.msg = t.content,
//              this.promptNotification(e)
//          },
//          !1)


      if (ShareSDK)
        this.sharePlatform = {
          qq: ShareSDK.PlatformType.QQFriend, qzone: ShareSDK.PlatformType.QZone,
          timeline: ShareSDK.PlatformType.WechatTimeline, wechat: ShareSDK.PlatformType.WechatSession,
          weibo: ShareSDK.PlatformType.SinaWeibo
        }

      // 删除app.html下的下载元素
      setTimeout(()=>{
        document.getElementById("dl").remove();
      },300);
    }else
      setTimeout(()=>{
        document.getElementById("dl") && document.getElementById("dl").addEventListener("click",()=>{
          this.goto({view:'download',no_msg:1})
        })
      },300);
  }

  promptNotification(t) {
    this.prompt("推送消息",t.msg,"取消",()=>{},"查看",()=>{this.goto(t)});
  }

  getUserInfo(resolve){
    this.getData('user',{per_page:'10',page:'1',list:'',silent:1}).then((res:any)=>{
      let {code,data} = res;
      if(code == 0){
        this.setU(data.userInfo);
        this.global.tel = data.userInfo.mobile_phone;
        this.plt.is("cordova") && this.jpush.setTags({sequence: data.userInfo.id, tags: ["has_account"]});
        this.getSettings(resolve);
      }
    })
    // this.getData('?m=user&c=user_info',{H5API:!1}).then(res=>{
    //   console.log(res);
    // })
  }

  getSettings(resolve){
      this.toast('正在加载账户设置'),
      this.getData('user_setting/getlist',{DGAPI: 1, silent: 1}).then((e: any) => {
        this.setSettings(e.data.length ? e.data[0] : {}, 0),
          this.toast('设置加载完成'),
          resolve()
      })
  }

  load() {
    // this.storage.get("settings").then(settings => {
    //   this.settings = settings ? settings : {};

      this.storage.get("global").then(global=>{
        this.global = global || {};
        this.storage.get("user").then(u => {
          this.setU(u || {});
          this.initialized = 1;
        })

        this.temp.copySupported = this.copyCheck()
      })
    // })
  }

  getData(url, data: any = {}) {
    /*
    * silent  //显示loading
    *
    * */
    let header = new Headers();
    header.append("X-ECTouch-Authorization", this.global.token);
    let options = new RequestOptions({ headers: header });

    let URL = url.indexOf('http://') == -1 ? this.BASE_URL + url : url;
    /*使用H5接口*/
    if (data.H5API) {
      delete data.H5API;
      URL = url.indexOf('http://') == -1 ? this.H5_BASE_URL + url : url;
      // options = null;
    }else if(data.DGAPI){
      delete data.DGAPI;
      URL = url.indexOf('http://') == -1 ? this.DG_BASE_URL + url : url;

      options = null;
    }

    /*如果参数中没有指定user_id，则默认携带上用户id和签名信息*/
    if (data.user_id === undefined)
      Object.assign(data, { user_id: this.u.id, sign: this.u.sign });

    if (data.silent)
      delete data.silent;
    else {
      this.loadingCount++;
      if (this.loadingCount == 1) {
        this.loading = this.loadingCtrl.create({
          spinner: "dots",
          content: "",
          duration: 10000
        });
        this.loading.present();
      }
    }
    return new Promise((resolve, reject) => {
      if (data.method=="get") {
        delete data.method;
        
        let str = '';
        for(var i in data) {
          str += '&' + i + "=" + data[i];
        }
        this.http.get(URL+str,options).map(t => {
          if (this.loadingCount) {
            this.loadingCount--;
            if (!this.loadingCount)
              this.loading.dismiss();
          }
          return t.json();
        }).subscribe(t => {
          resolve(t);
        }, err => {
          // this.alert('服务器错误');
        })
      } else {
        this.http.post(URL, data, options).map(t => {
          if (this.loadingCount) {
            this.loadingCount--;
            if (!this.loadingCount)
              this.loading.dismiss();
          }
          return t.json();
        }).subscribe(t => {
          resolve(t);
        }, err => {
          // reject();
          // this.alert('服务器错误');
        })
      }
    })
  }

  parseJson(str) {
    return new Promise((resolve, reject) => {
      resolve(JSON.parse(str));
    });
  }

  getCache(key: string) {
    return new Promise(resolve =>
      this.storage.get(key).then((res: any) =>
        res && res.expire ? (res.expire === true ? (resolve(res.data)) : (
          res.expire > +new Date() ? resolve(res.data) : this.storage.remove(key)
        )) : resolve(null)
        // resolve(res && res.expire > +new Date() ? res.data : null ))
      ));
  }

  setCache(key: string, value: any, expire: any = !0) {
    this.storage.set(key, { expire: expire === true ? expire : expire * 1000 + +new Date(), data: value });
  }

  // 回退到上一页
  pop() {
    if (!this.navCtrl)
      this.setActiveNavCtrl();
    this.navCtrl.canGoBack() && this.navCtrl.pop()
  }

  //当切换tab的时候 重新设置下navCtrl 虽然都是设置的getActiveNavs()[0] 实际表示的是当前tab的navCtrl
  setActiveNavCtrl(navCtrl = null, delay = 0) {
    if (delay)
      setTimeout(() => {
        this.navCtrl = navCtrl ? navCtrl : this.appCtrl.getActiveNavs()[0];
      }, delay);
    else
      this.navCtrl = navCtrl ? navCtrl : this.appCtrl.getActiveNavs()[0];
  }

  getActiveViewCtrl() {
    if (!this.navCtrl)
      this.setActiveNavCtrl();
    return this.navCtrl.getActive();
  }

  // 回到根页面
  gotoRoot() {
    if (!this.navCtrl)
      this.setActiveNavCtrl();

    this.navCtrl.popToRoot()
  }

  gotoDetail(params){
    if(params.shop_type == 3){
      params.view = "collage-detail";
      params.goods_id = params.goods_id || params.iid;
    }else
      params.view = "detail";
    this.goto(params);
  }
  // 跳转页面
  goto(params, view = '') {
    if (typeof params === 'string')
      params = { view: params };
    if (view)
      params.view = view;
    if (params.data) {
      params = Object.assign(params, params.data);
      delete params.data;
    }
    if (!params.view)
      return;

      switch(params.view){
        case 'browser':
          if(this.plt.is('cordova')){
            delete params.view;
            this.openBrowser(params.url, params);
          }else{
            this.toast('该功能请在app内使用');
            params.view = 'download';
          }
          break;
        case 'eval':
          delete params.view;
          eval(params.eval);
          break;
        case 'copy-and-open':
          if(this.temp.copySupported){
            this.copySucTip(params.text, params.suc ? params.suc : '复制成功');
            this.openTaobao();
            delete params.view;
          }else{
            params.view = 'download';
          }
          break;
        case 'copy':
          if(this.temp.copySupported){
            this.copySucTip(params.text, params.suc ? params.suc : '复制成功');
            delete params.view;
          }else{
            this.toast(params.err ? params.err : params.download ? '复制失败，请下载App使用' : '复制失败');
            params.download ? params.view = 'download' : (delete params.view);
          }
          break;
        case 'play':
          delete params.view;
          this.play(params.video);
          break;
        case 'download':
          !params.no_msg && this.toast(params.msg?params.msg:"该功能请在客户端中使用")
          break;
        // case "login":case"reg":case"money":
        //   //做排除用
        //   break;
        case"detail":
        case"products":
          params.up=JSON.stringify(params);
          //不加break 以便继续执行到default
        default:
          // if(this.plt.is("cordova"))
          //   this.styleDefault();
      }
    if (!this.navCtrl)
      this.setActiveNavCtrl();

    if (params.view) {
      this.temp.dl = 1;
      if (this.navCtrl.push) {
        this.navCtrl.push(params.view, params);
      } else {
        setTimeout(() => {
          this.setActiveNavCtrl();
          this.navCtrl.push(params.view, params);
        }, 100)
      }
    }
  }

  styleDefault(set = 1) {
    if (set) {
      if (!this.statusBarColor) return;
      this.statusBarColor = 0;
    }
    this.statusBar.styleDefault();
  }

  styleLightContent(set = 1) {
    if (set) {
      if (this.statusBarColor) return;
      this.statusBarColor = 1;
    }
    this.statusBar.styleLightContent();
  }

  // 检测是否登录  未登录时会自动跳转到登录页
  checkLogin(setPop = 1){
    return new Promise((resolve, reject) => {
      this.init().then(()=>{
        if(this.temp.pop) this.temp.pop=0,this.pop(),resolve(!1)
        else if(!this.u.id) setPop && (this.temp.pop=1),this.goto({view:"login"}),resolve(!1)
        else resolve(!0)
      })
    })
  }

  // 全局保存用户信息
  // setU(u = null) { //{} 清空     不传参数 也就是 n 会等于null this.u维持不变 直接storage.set
  //   let user = this.u,
  //     us = JSON.stringify(u);
  //   u = us == '{}' ? {} :         // {} 清空
  //     us == 'null' ? user :       // null  维持不变
  //       Object.assign(user, u);   // 合并更新
  //   console.log('setU', u);
  //   this.u = u;
  //   this.storage.set("user", this.u);
  // }
  setU(u=null){ //{} 清空     不传参数 也就是 n会等于null this.u维持不变 直接storage.set
    if(JSON.stringify(u) == "{}")  //对象是指针  所以不能用 ==/=== 判断
      this.u = u;
    else if(u)
      Object.assign(this.u,u);

    this.storage.set("user",this.u);
  }
  setGlobal(global={}){
    Object.assign(this.global,global);
    this.storage.set("global",this.global);
  }
  // 设置信息的保存
  setSettings(settings={}, sync = 1){
    return new Promise((resolve, reject) => {
      Object.assign(this.settings,settings);
      this.storage.set("settings",this.settings);
      if(this.u.id && sync){
        this.getData('user_setting/update',Object.assign({silent:1,DGAPI:1},this.settings)).then(e=>{
          resolve(e);
        })
      }else
        resolve();
    })
  }

  // 是否初始化完成
  init() {
    return new Promise((resolve, reject) => {
      if (this.initialized) resolve()
      else {
        let timer = setInterval(() => {
          this.initialized && (clearInterval(timer), resolve())
        }, 100);
      }
    });
  }
  copyCheck(){
    if(this.plt.is("cordova"))
      return true;
    else if(ClipboardJs.isSupported()){
      let cb = new ClipboardJs('.copy');
      cb.on('success', function(e){
          e.clearSelection();
      });
      return true;
    }
  }
  copy(t){this.copyBothTip(t,"复制成功","复制失败")}
  copySucTip(t,e){this.copyBothTip(t,e,"复制失败")}
  copyBothTip(t,e,n){
    this.plt.is("cordova") ?
      this.clipboard.copy(t).then(()=>{this.toast(e)},()=>{this.toast(n)}) :
    this.temp.copySupported ? (document.getElementById("copyTarget").innerText = t, this.toast(e)) : this.toast(n)
  }
  openTaobao(){
    if(this.plt.is('cordova'))
      this.appAvailability.check(this.plt.is("ios") ? 'taobao://' : "com.taobao.taobao").then(t => {
        this.openBrowser("taobao://",{target:"_system"});
      },
      e => {
        this.toast("请打开手机淘宝下单")
      })
    else if(this.plt.is("ios"))
      window.location.href = "taobao://";
    else{
      var n = document.createElement("IFRAME");
      n.setAttribute("src", "taobao://"),
      n.setAttribute("style", "display:none"),
      document.getElementById("copyTarget").insertBefore(n, null)
    }
  }
  
    openBrowser(url,params){
      return new Promise((resolve, reject) => {
        if(params.target != '_system'){
          if(this.statusBarColor)
            this.styleDefault(0);
        }
  
        params.browserButtons = params.browserButtons ? params.browserButtons : params.remainBrowserButtons ? this.browserOptions.browserButtons : this.browserButtons;
        let changeToolbar = !this.equals(this.browserOptions.browserButtons, params.browserButtons), changeTitle = !changeToolbar && params.title && this.browserOptions.title.staticText != params.title.staticText, event;
  
        Object.assign(this.browserOptions, params);
        this.browserOptions.url = url;
        this.browserOptions.resolve = resolve;
        this.browserOptions.reject = reject;
  
        if(this.browser){
          if(params.target == '_system')
            return this.browser.executeScript({code:"var _system="+url});
          else
            return params.hidden || (this.browserOptions.hidden = !1),
              changeTitle && this.browser.executeScript({code:"var _title="+this.browserOptions.title.staticText}),
              changeToolbar && this.browser.executeScript({code:"var _toolbar="+JSON.stringify(Object.assign({title:this.browserOptions.title},this.browserOptions.browserButtons))}),
              this.browserOptions.hidden || this.browser.show(),
              this.browser.executeScript({code:this.plt.is('ios') ? 'var _open='+url : 'document.write("<div style=\' position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url(http://www.bujie.com/tpl/red/images/loading.gif) center center no-repeat;\'></div><script>window.location.href = \''+url+'\'</script>")'});
        }else{
          if(params.target == '_system'){
            if(typeof params.hidden == 'undefined')
              this.browserOptions.hidden = true;
          }else if(!this.browserOptions.hidden)
            setTimeout(()=>{this.nativeToast('加载中')},250)
  
          Object.assign(this.browserOptions, this.browserOptions.browserButtons),
          this.browser = this.themeableBrowser.create(params.target == '_system' ? "about:blank" :url, '_blank', this.browserOptions);
        }
  
        this.browser.on('exit').subscribe(e => {
          if(this.statusBarColor)
            this.styleLightContent(0);
        });
      });
    }
  
    play(video, e = null){
      if(this.plt.is('cordova')){
        this.streamingMedia.playVideo(video, this.options);
      }else if(this.plt.is('ios')){
        this.toast('加载中');
        this.temp.video = this.sanitizer.bypassSecurityTrustResourceUrl(video);
        let videoEle:any = document.getElementById('video');
        videoEle.play();
      }else{
        this.goto({view:'download', msg:'视频请到app内播放'});
      }
      if(e)
        e.stopPropagation();
    }

  toast(t) {
    return this.toastPosition(t, "middle")
  }

  toastPosition(t, e) {
    return this.toastPositionDuration(t, e, 3e3)
  }

  toastPositionDuration(t, e, n) {
    var i = this;
    return new Promise((r, s) => {
      var tt = i.toastCtrl.create({ message: t, duration: n, position: e });
      tt.onDidDismiss(() => {
        r()
      }), tt.present()
    })
  }
  
    nativeToast(t){
      this.nativeToastDuration(t,"5000")
    }
    nativeToastDuration(t,time){
      this.xToast.show(t,time,"center").subscribe(t=>{}) /*需要加上subscribe不然ios下不显示*/
    }

  getQueryString(t) {
    return this.getUrlParam(t, window.location.search.substr(1))
  }

  getUrlParam(t, e) {
    var n = new RegExp("(^|&)" + t + "=([^&]*)(&|$)", "i"), i = e.match(n);
    return null != i ? decodeURIComponent(i[2]) : null
  }

  getSharePic(controller, filename, opts: any = {}, url = '') {
    let item = Object.assign({}, opts);
    switch (controller) {
      case 'product':
        item.view = 'detail';
        item.pic = item.pic.replace("_160x160.jpg", "_600x600.jpg").replace(".160x160.jpg", ".600x.jpg").replace("s=160x160&", "");
        filename = item.iid;
        url = this.DG_BASE_URL + 'qrcode/' + controller + '/' + filename + '.png?params=' + encodeURIComponent(JSON.stringify(item)) + (this.u.auth ? "&state=" + this.u.auth : "") + '&' + filename + '.png';
        break;
    }
    return url;
  }

  getShareUrl(url: any = '') {
    let /*timestamp = new Date(new Date().toLocaleDateString()).getTime()/1000, */share_url: any = "";

    url = url.split("#");

    // #前面部分
    share_url = url[0];
    share_url = share_url.split("?");
    share_url = share_url[0] + "?state=" + this.u.auth /*+ "&_t=" + timestamp*/ + (share_url[1] ? "&" + share_url[1] : "");

    if (share_url.indexOf("http") !== 0)
      share_url = this.WWW_URL + share_url;
    // #后面部分
    if (url[1])
      share_url += "#" + url[1];
    return share_url;
  }

  share(t) {
    return new Promise((resolve, reject) => {
      var e = this.popoverCtrl.create("share", t.type == 'url' ? { hideSave: 1 } : {}, { cssClass: 'share-container' });
      e.onDidDismiss(data => {
        resolve();
      });
      e.present(), this.shareOpt = t;
    })
  }
  
  
    shareTo(t) {
      var packageName, clientType, appName, opt: any = this.shareOpt;
      if (!opt) return;
      if (t == 'weibo' && opt.type == 'url') //微博不能直接分享网页链接出去 改成加到内容中的普通分享
        delete opt.type, opt.weiboPic && (opt.pic = opt.weiboPic, delete opt.weiboPic)
      if (opt.type == 'url')
        delete opt.type
      else if (opt.url)
        opt.message += "\r\n" + opt.url, delete opt.url;
  
      if (typeof opt.pic == 'object' && opt.pic.length == 1)
        opt.pic = opt.pic[0];
  
      var isIos11 = !1;
      if (t != 'weibo' && t != 'save') {
        // ios 11 下 原生分享到微信、朋友圈等报错 —— but remote VC failed, dismissing
        isIos11 = this.plt.versions().ios && this.plt.versions().ios.major >= 11;
        if (isIos11 && typeof opt.pic == 'object')
          return this.toast('ios11下不支持多图分享QQ空间，请点击右下角-保存图片后自行分享'), false;
      }
      switch (t) {
        case "qzone":
          //QQ空间APP不支持分享链接  当分享链接到QQ空间时 采用通过QQ分享到空间的方式
          if (opt.url || isIos11) {
            t = "qq";
            clientType = ShareSDK.ClientType.QQ;
            appName = 'QQ'
          } else {
            packageName = this.plt.is("ios") ? "com.tencent.mqq.ShareExtension" : "com.qzone";
            appName = 'QQ空间';
          }
          break;
        case "qq":
          if (opt.url || isIos11)
            clientType = ShareSDK.ClientType.QQ;
          else
            packageName = this.plt.is("ios") ? "com.tencent.mqq.ShareExtension" : "com.tencent.mobileqq";
          appName = 'QQ';
          break;
        case "wechat":
          //android 单图 分享到微信  显示的是文件 而不是 图片  所以采用 shareSDK 的方式
          if (opt.url || (typeof opt.pic != 'object' && this.plt.is("android")) || isIos11)
            clientType = ShareSDK.ClientType.Wechat;
          else
            packageName = this.plt.is("ios") ? "com.tencent.xin.sharetimeline" : "com.tencent.mm";
          appName = '微信';
          break;
        case "timeline":
          if (isIos11 && typeof opt.pic == 'object')
            return this.toast('ios11下不支持多图分享朋友圈，请点击右下角-保存图片后自行分享'), false;
  
          if (opt.url || isIos11)
            clientType = ShareSDK.ClientType.Wechat;
          else
            packageName = this.plt.is("ios") ? "com.tencent.xin.sharetimeline" : "com.tencent.mm/com.tencent.mm.ui.tools.ShareToTimeLineUI";
          appName = '微信';
          break;
        case "weibo":
          if (opt.url || this.plt.is("ios"))
            clientType = ShareSDK.ClientType.SinaWeibo;
          else
          //com.sina.weibo.ShareExtension 就是不出来分享图片 分享不了
          //com.apple.social.sinaweibo、com.apple.share.SinaWeibo.post 官方的、要在系统设置里面设置账户
          //this.plt.is("ios")?"com.sina.weibo.ShareExtension":
            packageName = "com.sina.weibo";
          appName = '微博';
          break;
        case "save":
          this.toast("保存中");
          this.photoLibrary.requestAuthorization().then(() => {
            if (typeof this.shareOpt.pic == 'object') {
              let saveImg = (key) => {
                setTimeout(() => {
                  this.toast('正在保存第' + (key + 1) + '张');
                  this.photoLibrary.saveImage(this.shareOpt.pic[key], this.plt.is("ios") ? "Camera Roll" : this.APP_NAME);
                }, key * 600)
              }
              for (var i = 0, len = this.shareOpt.pic.length; i < len; i++) {
                //来个setTimeout 直接循环写的话 会出现 write busy 错误
                saveImg(i);
              }
              setTimeout(() => {
                this.toast("保存成功")
              }, this.shareOpt.pic.length * 600)
            } else
              this.photoLibrary.saveImage(this.shareOpt.pic, this.plt.is("ios") ? "Camera Roll" : this.APP_NAME), this.toast("保存成功");
          }).catch(err => {
            this.toast("未授权访问相册，保存失败")
          });
          break;
      }
      if (clientType) {
        this.toastPositionDuration("即将打开" + appName, "middle", 10000);
        sharesdk.isInstallClient.promise(clientType).then(n => {
          n ?
            opt.url ?
              sharesdk.share(this.sharePlatform[t], ShareSDK.ShareType.WebPage, {
                icon: opt.pic,
                title: opt.title,
                text: opt.message,
                url: opt.url
              }, (t) => {
                this.toast("分享成功")
              }, (t) => {
                this.toast("分享失败")
              }) :
              sharesdk.share(this.sharePlatform[t], ShareSDK.ShareType.Image, {
                image: opt.pic,
                title: opt.title,
                text: opt.message
              }, (t) => {
                this.toast("分享成功")
              }, (t) => {
                this.toast("分享失败")
              }) :
            this.toast("未安装" + appName)
        });
      } else if (packageName) {
        this.toast("即将打开" + appName);
        this.socialSharing.canShareVia(packageName).then(() => {
          if (t != 'weibo' && this.plt.is("ios") && this.statusBarColor)
            this.styleDefault(0);
          //安卓里面被分享的应用 基本是 singletask 的  会立即执行回调  所以执行成功的回调就不提示了
          this.socialSharing.shareVia(packageName, opt.message, opt.message, opt.pic, opt.url).then((t) => {
            this.plt.is("ios") && this.toast("分享成功"), t != 'weibo' && this.plt.is("ios") && this.statusBarColor && this.styleLightContent(0)
          }, (t) => {
            this.plt.is("ios") && this.toast("分享失败"), t != 'weibo' && this.plt.is("ios") && this.statusBarColor && this.styleLightContent(0)
          })
        }).catch(() => {
          this.toast("未安装" + appName)
        });
      }
      return true;
    }
  
    // resource_type 0 图片 1 视频
    // saveResource(resouce, resource_type = 0) {
    //   return new Promise((resolve, reject) => {
    //     this.toast("保存中");
    //     this.photoLibrary.requestAuthorization().then(() => {
    //       resource_type ?
    //         this.photoLibrary.saveVideo(resouce, this.plt.is("ios") ? "Camera Roll" : this.APP_NAME).then(() => {
    //           this.toast("已成功保存到相册"), resolve()
    //         }, () => {
    //           this.toast("保存失败，请联系客服"), reject()
    //         }) :
    //         this.photoLibrary.saveImage(resouce, this.plt.is("ios") ? "Camera Roll" : this.APP_NAME).then(() => {
    //           this.toast("已成功保存到相册"), resolve()
    //         }, () => {
    //           this.toast("保存失败，请联系客服"), reject()
    //         })
    //     }).catch(err => {
    //       this.toast("未授权访问相册，保存失败")
    //     });
    //   })
    // }
  

  actionsheet(title, btns) {
    var i = this.actionsheetCtrl.create({
      title: title,
      cssClass: "action-sheets-basic-page",
      buttons: btns
    });
    i.present()
  }

  alert(t) {
    const alert = this.alertCtrl.create({
      subTitle: t,
      buttons: ['知道了']
    });
    alert.present();
    return alert;
  }

  //title,message,btn1_text,btn1_callback,btn2_text,btn2_callback
  prompt(t, e, n, i, r, s) {
    let p = this.alertCtrl.create({
      title: t,
      message: e,
      enableBackdropDismiss: false,
      buttons: [{
        text: n,
        handler: t => {
          return i()
        }
      },
      {
        text: r,
        handler: t => {
          return s()
        }
      }]
    });
    p.present()
  }

  isWechat() {
    return navigator.userAgent.toLowerCase().match(/MicroMessenger/i) + "" == "micromessenger"
  }

  // 同Jquery
  hasClass(t, e) {
    return t.className.match(new RegExp("(\\s|^)" + e + "(\\s|$)"))
  }

  addClass(t, e) {
    this.hasClass(t, e) || (t.className += " " + e)
  }

  removeClass(t, e) {
    if (this.hasClass(t, e)) {
      var n = new RegExp("(\\s|^)" + e + "(\\s|$)");
      t.className = t.className.replace(n, "")
    }
  }

  toggleClass(t, e) {
    console.log(t, e);
    this.hasClass(t, e) ? this.removeClass(t, e) : this.addClass(t, e)
  }

  buy(t, e, buy_page_url) {
    t.buy_page_url = buy_page_url;
    t.callback = e;
    t.view = 'pay';
    this.goto(t);
  }
  pay(t, e, fail = null) {
    if (this.isWechat() && t.type == 1) {
      this.toast("正在生成支付信息");
      t.open_id = localStorage.getItem('openid');
      t.pay_type = 'wxpay';
      this.getData("payment/pay", t).then((i: any) => {
        if(typeof i.data == 'string')
          this.toast(i.msg)
        else
          window['WeixinJSBridge'].invoke("getBrandWCPayRequest", i.data, (t) => {
            "get_brand_wcpay_request:ok" == t.err_msg ? e() : this.toast("支付失败"), fail && fail()
          })
      })
    } else if (!this.plt.is('cordova') && t.type == 1){
      this.toast("仅微信或APP内支持微信支付"), fail && fail()
    } else {
      t.open_id = 'mock one';
      switch(parseInt(t.type)){
        case 0:
          t.pay_type = 'balance'; 
        break;
        case 1:
          t.pay_type = 'wechat_pay'; 
        break;
        case 2:
          t.pay_type = this.plt.is('cordova') ? 'alipay' : 'alipay_web';
        break;
      }
      this.getData("payment/pay", t).then((i: any) => {
        if(t.type == 0)
          if(i.data)
            this.toast(i.data), fail && fail();
          else
            this.getData("payment/notify", { id: t.id }).then((res: any) => {
              if (res.code == 0) {
                e();
              }else
                this.toast(res.msg), fail && fail();
            })
        else if(t.type == 2 && i.data.indexOf('http') === 0)
            window.location.href = this.WWW_URL + "pay.htm?goto=" + encodeURIComponent(i.data);
        else if(t.type == 2 && i.data.indexOf('app_id') == -1 || (t.type == 1 && typeof i.data == 'string'))
          this.toast(i.data), fail && fail();
        else
          lyxpay.pay(t.type, t.type == 1 && this.plt.is("android") ? JSON.stringify(i.data) : i.data, {
            success: () => {
              e()
            },
            failure: t => {
              //支付宝的错误码
              /*
              if (8000 == t || 6004 == t)
                this.toast('支付结果确认中'), this.getData("tradelist/check", { id: i.msg }).then((i: any) => {
                  i.msg ? e() : fail ? fail() : this.toast("支付失败")
                })
              else */
              this.toast("支付失败"), fail && fail()
            }
          })
      })
    }
  }

  // error(error: any = '非法请求') {
  //   if (typeof error == 'string') {
  //     error = {
  //       msg: error,
  //       goBack: true
  //     }
  //   }
  //   this.alert(error.msg);
  //   error.goBack && this.goback();
  // }

  getPurePic(pic){
    pic = pic.indexOf('51fanli') > 0 ? pic.replace("_160x160.jpg", ".jpg") : pic.replace("_160x160.jpg", "");
    return pic.replace(".160x160.jpg", ".jpg").replace("s=320x320&", ".jpg").replace("s=160x160&", ".jpg");
  }
  getShareTextFormat(type,wrap='\r\n'){
    let format;
    switch(type){
      case 1: // 有券能用
        format = "{title}"+wrap+"券后{coupon_price}元 {coupon_amount}元券 （{coupon_info}）"+wrap+"领券并下单淘口令：{tkl}"+wrap+"复制整段信息，打开手机淘宝即可下单";
        break;
      case 2: // 有券 单品不能用 满减
        format = "{title}"+wrap+"折后{zk_price}元 另有{coupon_amount}元优惠券 （{coupon_info}）"+wrap+"下单淘口令：{tkl}"+wrap+"复制整段信息，打开手机淘宝即可下单";
        break;
      default: // 没券
        format = "{title}"+wrap+"折后{zk_price}元"+wrap+"领券并下单淘口令：{tkl}"+wrap+"复制整段信息，打开手机淘宝即可下单";
        break;
    }
    return format;
  }
  getShareText(item,wrap='\r\n'){
    return new Promise((resolve, reject) => {
      let type = item.coupon_price ? 1 : item.coupon_amount ? 2 : 0, format = this.getShareTextFormat(type,wrap), link="", fn = (format,item,link) => {
        return format.replace('{title}',item.title).replace('{coupon_price}',item.coupon_price).replace('{coupon_amount}',item.coupon_amount).replace('{coupon_info}',item.coupon_info?item.coupon_info:item.coupon_amount?item.coupon_amount+'元券':'').replace('{tkl}',item.tkl || (this.plt.is('cordova')?'获取中':'获取口令失败')).replace('{zk_price}',item.zk_price).replace('{price}',item.price).replace('{vip_price}',item.vip_price).replace('{sheng}',item.max_comm_fee).replace('{link}',link)
      };
//      if(item.tkl){
        if(format.indexOf('{link}') != -1){
          item.view = 'detail';
          this.getData('short_url/generate',item).then((res:any)=>{
            link = res;
            resolve(fn(format,item,link))
          })
        }else
          resolve(fn(format,item,link));
//      }
    })
  }
  
  handleLogin(n) {
    return new Promise((resolve, reject) => {
      this.toast(n.info ? n.info : '登录成功');
      if (n.token) {
          this.setGlobal({token:n.token});
          this.getUserInfo(resolve);        
      }
    });
  }

  /*退出登录*/
  logout() {
    return new Promise((resolve, reject) => {
      localStorage.setItem('openid','');
      this.setGlobal({token:null});
      this.setU({});
      resolve();
    });
  }

  equals(x, y) {
    if (x === y) {
      return true; // if both x and y are null or undefined and exactly the same
    } else if (!(x instanceof Object) || !(y instanceof Object)) {
      return false; // if they are not strictly equal, they both need to be Objects
    } else if (x.constructor !== y.constructor) {
      // they must have the exact same prototype chain, the closest we can do is
      // test their constructor.
      return false;
    } else {
      for (const p in x) {
        if (!x.hasOwnProperty(p)) {
          continue; // other properties were tested using x.constructor === y.constructor
        }
        if (!y.hasOwnProperty(p)) {
          return false; // allows to compare x[ p ] and y[ p ] when set to undefined
        }
        if (x[p] === y[p]) {
          continue; // if they have the same strict value or identity then they are equal
        }
        if (typeof (x[p]) !== 'object') {
          return false; // Numbers, Strings, Functions, Booleans must be strictly equal
        }
        if (!this.equals(x[p], y[p])) {
          return false;
        }
      }
      for (const p in y) {
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
          return false;
        }
      }
      return true;
    }
  }
}