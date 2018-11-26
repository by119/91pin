import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams,Searchbar,InfiniteScroll } from 'ionic-angular';
import {CommonProvider} from "../../providers/common/common";
import { Keyboard } from '@ionic-native/keyboard';
import { Storage } from '@ionic/storage';


@IonicPage({
  name: 'pintuan',
  priority: 'off'
})
@Component({
  selector: 'page-pintuan',
  templateUrl: 'pintuan.html',
})
export class PintuanPage {
  @ViewChild(Searchbar) searchbar: Searchbar;
  @ViewChild(InfiniteScroll) infiniteScroll : InfiniteScroll;

  title = "拼团";
  focus;

  ads_left:any = [];
  ads_right:any = [];
  banner:any = [];
  banner_bottom = [];
  team_categories_child = [];
  goodList = [];
  categories = [];
  histories=[];
  params:any = {ru_id:0, size:40, page:0, tc_id:0};


  constructor(public navCtrl: NavController,
              public cp: CommonProvider,
              public navParams: NavParams,
              public storage: Storage,
              public keyboard:Keyboard) {
                storage.get("searchHistories").then(t=>{t&&(this.histories=t)});
  }

  ionViewDidLoad() {
    this.params.ru_id = this.navParams.get('ru_id') || 0;    
    if(this.params.ru_id)
      this.title = "该商家拼团";
      
    this.getTeam();
    this.doInfinite();
    this.getCategoriesIndex();
  }

  toggleType(tc_id){
    if(this.params.tc_id==tc_id)
      return;

    this.infiniteScroll.enable(true);
    this.goodList = [];
    this.params.tc_id = tc_id;
    this.params.page = 0;
    this.doInfinite();
    this.getCategoriesIndex();
  }

  /*获取分类导航数据*/
  getCategoriesIndex(){
    if(this.params.tc_id == 0)
      this.getTeam();
    else
      this.cp.getData('team/categoriesIndex',{tc_id:this.params.tc_id}).then((res:any)=>{
        if(res.code==0){
          let {
            ads_left=[],
            ads_right=[],
            banner=[],
            banner_bottom=[],
            team_categories_child=[]
          } = res.data;
          this.ads_left=ads_left;
          this.ads_right=ads_right;
          this.banner=banner;
          this.banner_bottom=banner_bottom;
          this.team_categories_child=team_categories_child;
        }
      })
  }

  /*获取分类列表*/
  getTeam(){
    this.cp.getData('team').then((res:any)=>{
      if(res.code==0){
        let {
          ad_best_left:ads_left=[],
          ad_best_right:ads_right=[],
          team_categories:categories=[],
          team_categories_child=[],
          banner=[],
          banner_bottom=[]
        } = res.data;
        this.categories = categories;
        this.ads_left = ads_left;
        this.ads_right = ads_right;
        this.banner = banner;
        this.banner_bottom = banner_bottom;
        this.team_categories_child=team_categories_child;
      }
    })
  }

  search() {
    this.params.keyword && (
      this.histories.length > 0 && (this.histories.forEach((e, n) => {
        e == this.params.keyword && this.histories.splice(n, 1)
      },
      this), this.histories.length >= 30 && this.histories.pop()), this.cp.getData("user_search_log/add", {
          keyword: this.params.keyword,
          silent: 1,
          DGAPI: 1
      }),
      this.histories.unshift(this.params.keyword),
      this.storage.set("searchHistories", this.histories),
      this.goodList = [],
      this.params.page=0,
      this.focus=false,
      this.doInfinite()
   )
  }
  setFocus(){
    this.focus = true;
    setTimeout(()=>{this.searchbar.setFocus(),this.cp.plt.is('android') && this.keyboard.show()},100);
  }
  cancel(){
    this.focus = false;
  }
  
  doInfinite() {
    this.params.page++;
    this.cp.getData('team/teamList', this.params).then((res:any)=>{
      if(res.code == 0){
        this.goodList = this.goodList.concat(res.data);
        if(res.data.length != this.params.size)
          this.infiniteScroll.enable(false);
        this.infiniteScroll.complete()
      }
    })
  }

}