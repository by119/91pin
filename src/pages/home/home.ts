import { Component, ViewChild } from '@angular/core';
import { IonicPage, Content } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";

@IonicPage({
  name: 'home',
  priority: 'off'
})

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;

  navList: any[] = [];

  sysMsgCount = 1; loadedSysMsg; items; immidiate = !1; init = 0; adv = { 1: [], 2: [], 3: [], 4: [] };

  pet: string = "0";

  constructor(
    public cp: CommonProvider
  ) {
    this.cp.init().then(() => {
      setTimeout(() => {
        if (this.cp.temp.no_network) {
          let timer = setInterval(() => {
            if (!this.cp.temp.no_network) {
              clearInterval(timer), this.initialize();
            }
          }, 200);
        } else
          this.initialize();
      }, 100); //延时100毫秒 让app.component.ts中的no_network设置完成
    })
  }

  initialize() {
    if (this.cp.temp.logining) {
      let timer = setInterval(() => {
        if (!this.cp.temp.logining)
          clearInterval(timer), setTimeout(() => { this.operate() }, 500) //成功登陆后 让看个0.5秒的提示在操作其他
      }, 200)
    } else
      this.operate();

    //如果是跳转的那种 就不加载了直接跳 后面回到本页时 再加载
    if (this.immidiate)
      return setTimeout(() => { this.init = -1, this.immidiate = !1 }, 500)

    if (this.cp.global.adv)
      this.adv = this.cp.global.adv;

    // if (this.cp.global.nav)
    //   this.navList = this.cp.global.nav;

    this.categoryList();

    this.load(1);
  }

  ionViewWillEnter() {
    //如果是跳转的那种 就不加载了直接跳 后面回到本页时 再加载
    this.load();
  }

  ionViewDidEnter(){
    if(this.cp.plt.is("cordova"))
      this.cp.styleLightContent();
  } 

  load(set = 0) {
    if (!this.init && !set) return;

    if (!this.init) {
      this.cp.getData("adv/getList", { type: '1,2,3,4', classified: 1, DGAPI: 1 }).then((n: any) => {
        this.adv = n;
        this.cp.setGlobal({ adv: this.adv });
      })
    }

    this.getPerHour();
  }

  getPerHour() {
    let timestamp = Date.parse(new Date() + "") / 1000;
    if (this.cp.u.id) {
      if (!this.cp.temp.sysmsg_time || timestamp - this.cp.temp.sysmsg_time > 3600) {
        this.cp.getData("sys_msg/count", { silent: 1, DGAPI: 1 }).then((r: any) => {
          this.sysMsgCount = r.count;
        })

        this.cp.temp.sysmsg_time = timestamp;
      }
    }

    if (!this.cp.temp.index_time || timestamp - this.cp.temp.index_time > 3600) {
      this.cp.getData("product/getlist", { silent: 1, numPerPage: 9, DGAPI: 1 }).then((h: any) => {
        this.items = h.data;
      });

      this.cp.temp.index_time = timestamp;
    }
  }

  changeSeg(item){
    this.jump({view:'products', category_id:item.id, title:item.name})
  }

  jump(params, immidiate = false) {
    params.params && (params = JSON.parse(params.params))/*,"string"==typeof params&&(params=eval("("+params+")"))*/;

    if (immidiate)
      this.immidiate = true;

    this.cp.goto(params);
  }

  operate() {
    let t = window['location'].search.substr(1);
    t && this.operateUrl(t)
  };
  operateUrl(t) {
    var e: any = {};
    this.cp.getUrlParam("params", t) && (e = JSON.parse(this.cp.getUrlParam("params", t))),
      "string" == typeof e && (e = JSON.parse(e));
    var n = this.cp.getUrlParam("state", t);
    if (!e.view) {
      let i = this.cp.getUrlParam("view", t);
      switch (i) {
        case 'article':
          (e.id || (e.id = this.cp.getUrlParam("id", t)), e.id || (e = null))
          break;
        case 'detail':
          (e.iid || (e.iid = this.cp.getUrlParam("iid", t)), e.iid || (e = null))
          break;
      }
      if (i) e.view = i;
    }
    n && this.cp.setGlobal({ "auth": n }),
      e.view && this.jump(e, true)
  };
  categoryList() {
    // category/getlist 首页头部导航栏
    this.cp.getData("category/getlist", { 
      silent: 1,
      numPerPage: 9,
      DGAPI: 1 
    }).then((h: any) => {
      this.navList = h;
      // this.cp.setGlobal({ nav: this.navList });
    });
  }
}
