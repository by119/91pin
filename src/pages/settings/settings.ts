import { Component } from '@angular/core';
import {ActionSheetController, IonicPage} from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';

declare var GetAjaxRequest: any;

@IonicPage({
  priority: 'off',
  name : 'settings',
  defaultHistory : ['welcome']
})
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  versionNumber="";
  wechat="后续可直接使用微信一键登录";
  ratingUrl:any = "http://sj.qq.com/myapp/detail.htm?apkName=com.jianshi.shengqianbao";

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public cp: CommonProvider) {
  }

  ionViewWillEnter(){
      this.cp.checkLogin().then(loaded=>{
        if(loaded){
          this.cp.u.wechat_unionid&&(this.wechat="已绑定"+(this.cp.u.wechat_nickname?"："+this.cp.u.wechat_nickname:"")),this.cp.plt.is("cordova")&&window['cordova'].getAppVersion.getVersionNumber().then(t=>{this.versionNumber=t});
        }
      })
  }

  bindWechat(){
    this.cp.u.wechat_unionid ? this.cp.toast("已成功绑定") : this.cp.plt.is("cordova") ? (this.cp.plt.is("android") && this.cp.toast("即将登录"), GetAjaxRequest.login((e:any) => {
        e.state = this.cp.u.id + "_" + this.cp.u.sign,
        this.cp.toast("正在登录"),
        this.cp.getData("user/wechatLoginApp", e).then((n: any) => {
            n.status ? (this.cp.toast(n.msg), this.cp.setU(n.data), this.wechat = "已绑定：" + this.cp.u.wechat_nickname) : this.cp.toast(n.msg)
        })
    }, (err:any)=>{ this.cp.toast(err.errmsg)})) : this.cp.toast("请在微信内或下载APP使用")
  }


  logout() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '真的要退出吗？',
      buttons: [
        {
          text: '退出登录',
          role: 'destructive',
          handler: () => {
            this.cp.logout().then(() => {
              this.cp.toast('您已退出登录！');
              this.cp.gotoRoot();
            })
          }
        },
        {
          text: '取消',
          role: 'cancel',
        }
      ]
    });

    actionSheet.present()
  }


  rating(){
    console.log('评分支持');
  }
}
