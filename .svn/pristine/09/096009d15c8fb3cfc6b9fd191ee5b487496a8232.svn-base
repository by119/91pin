import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, InfiniteScroll, Content } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";

/**
 * Generated class for the TeamUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
 
@IonicPage({
  name: 'team-user'
})
@Component({
  selector: 'page-team-user',
  templateUrl: 'team-user.html',
})
export class TeamUserPage {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  @ViewChild(Content) content: Content;
  items = []; page = 0; res:any= []; params: any = {}; infiniteScrollState = !0;
  size = 20;//一次请求数据条数
  team_id = 0;
  constructor(public navCtrl: NavController,
    public cp: CommonProvider,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.team_id = this.navParams.get('team_id') || 0;    
    this.page == 0 && this.doInfinite()
  }
  
  doInfinite() {
    this.params = {
      page: ++this.page,
      size: this.size,
      team_id: this.team_id
    }    
    this.cp.getData("team/teamUser", this.params).then((e: any) => {
      if (e.data.length > 0) {
        this.res = e;
        this.items = this.items.concat(this.res.data);
        this.infiniteScroll.complete();
      } else {
        this.infiniteScrollState = !1;
        this.infiniteScroll.enable(this.infiniteScrollState);
      }
    })
  }

}
