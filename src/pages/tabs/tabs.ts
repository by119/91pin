import { Component,ViewChild } from '@angular/core';
import { IonicPage,Tabs } from 'ionic-angular';
import { BackButtonService } from "../../providers/common/backButtonService";
import { CommonProvider } from '../../providers/common/common';

@IonicPage({
  name:'welcome'
})
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  @ViewChild(Tabs) tabs: Tabs;
  // @ViewChild(Slides) slides : Slides;

  tab1Root = 'home';
  tab2Root = 'products';
  // tab3Root = 'group';
  tab4Root = 'cart';
  tab5Root = 'center';

  constructor(public cp: CommonProvider, public backButtonService: BackButtonService) {
    this.cp.plt.ready().then(() => {
      this.backButtonService.registerBackButtonAction(this.tabs);
      
      // this.cp.init().then(()=>{
      //   if(!this.cp.global.guild && this.cp.plt.is("cordova"))
      //     this.items = ['./assets/imgs/guild/1.jpg','./assets/imgs/guild/2.jpg','./assets/imgs/guild/3.jpg','./assets/imgs/guild/4.jpg'];
      // })
      // tabs.html下的下载元素会生效 删除app.html下的下载元素
      if(!this.cp.plt.is("cordova"))
        document.getElementById("dl") && document.getElementById("dl").remove();
    });
  }
  // hide(){
  //   if(this.slides.isEnd()){
  //     this.cp.setGlobal({guild:1});
  //     this.items = [];
  //   }
  // }
  tabsSwitched(e){
    this.cp.setActiveNavCtrl();
  }
}