import { Component,ViewChild } from '@angular/core';
import {  IonicPage, Searchbar } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';

@IonicPage({
  priority: 'off',
  name: 'search',
  defaultHistory: ['welcome']
})
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  @ViewChild(Searchbar) searchbar: Searchbar;
  
  histories=[];searchText="";hot;init;

  constructor(public cp: CommonProvider, public storage: Storage, public keyboard:Keyboard) {
    this.cp.init().then(()=>{
      this.storage.get("searchHistories").then(t => {t&&(this.histories=t)});

      let timestamp = Date.parse(new Date()+"") / 1000;
      if(timestamp - this.cp.temp.search_time > 3600*3 || !this.cp.temp.search_time){
        this.cp.getData("user_search_log/getList",{numPerPage:7,DGAPI:1}).then((e:any) => {
          this.hot=e.data;
          this.storage.set("hotSearchWords",this.hot);
          this.init = true;
        });
        this.cp.temp.search_time = timestamp;
      }else
        this.storage.get("hotSearchWords").then(res=>{
          this.hot = res;
          this.init = true;
        })
    })
  }
   
  ionViewDidEnter(){
    if(this.cp.plt.is("cordova"))
      this.cp.styleDefault();

    let timer = setInterval(()=>{
      this.init && (clearInterval(timer), setTimeout(()=>{this.searchbar.setFocus(), this.cp.plt.is('android') && this.keyboard.show()},200))
    },200)
  }
   
  goSearch(t) {
    this.searchText = t;
    this.search()
  }
  search() {
      this.searchText && ( this.histories.length > 0 && (this.histories.forEach((e, n) => {
          e == this.searchText && this.histories.splice(n, 1)
      },
      this), this.histories.length >= 30 && this.histories.pop()), this.cp.getData("user_search_log/add", {
          keyword: this.searchText,
          silent: 1,
          DGAPI: 1
      }), this.histories.unshift(this.searchText),
      this.storage.set("searchHistories", this.histories),
      this.cp.goto({view:"products", 
          keyword: this.searchText
      }))
  }
  del(t) {
      this.histories.splice(t, 1),
      this.storage.set("searchHistories", this.histories)
  }
  clear() {
      this.cp.prompt("清空历史", "确认清空历史记录？", "取消",
      () => {},
      "清空",
      () => {
          this.histories = [],
          this.storage.set("searchHistories", this.histories)
      })
  }

  back(){
    this.cp.pop();
  }
}
