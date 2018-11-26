import { Component } from '@angular/core';
import { ActionSheetController, IonicPage, NavController } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";


@IonicPage({
  name: 'center',
  priority: 'off'
})
@Component({
  selector: 'page-center',
  templateUrl: 'center.html',
})
export class CenterPage {
  funds = {};
  order = {};
  list = '';

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public cp: CommonProvider) {
      this.cp.init().then(res => {
        if (!this.cp.u.id) 
          setTimeout(()=>{
            this.goTo('login')
          }, 500); // 延时500毫秒 让navCtrl被设置为当前的tab的navCtrl后再跳转
      })
  }

  ionViewWillEnter(){
    this.init();
  }

  init() {
    this.cp.init().then(res => {
      if (this.cp.u.id)
        this.user();
    })
  }

  goTo(url) {
    switch(url){
      // case "article":
      //   //做排除用 这些页面不用登录
      //   break;
      default:
        if(!this.cp.u.id) url = 'login';
        break;
    }
    this.cp.goto(url)
  }

  user() {
    this.cp.getCache('list').then((t: any) => {
      let list: any = t ? t : '';
      this.list = list;
      this.cp.getData('user', {
        list: list,
        silent: true
      }).then(
        (t: any) => {
          if(t.code == 0){
            this.funds = t.data.funds;
            this.order = t.data.order;
            this.cp.setU(t.data.userInfo)
          }
        }
      )
    });
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
              this.init();
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

}
