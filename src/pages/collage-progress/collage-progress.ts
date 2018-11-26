import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";
import { WechatApi } from '../../providers/common/wechatApi';


@IonicPage({
  name: 'collage-progress',
  segment: 'collage-progress/:team_id/:user_id'
})
@Component({
  selector: 'page-collage-progress',
  templateUrl: 'collage-progress.html',
})
export class CollageProgressPage {
  team_id = null;
  user_id = null;
  teamUser = [];
  teamInfo:any = '';
  difftime = 0;//结束时间戳
  difftimeStr = '00:00:00'; //剩余时间字符串
  ruleState: boolean = false; //拼团规则状态 false隐藏  true显示

  constructor(public navCtrl: NavController,
    public cp: CommonProvider,
    public api: WechatApi,
    public navParams: NavParams) {
      this.team_id = this.navParams.get('team_id') || 0;
      this.user_id = this.navParams.get('user_id') || 0;
  }

  ionViewWillEnter() {
    this.cp.checkLogin().then(loaded=>{
      if(loaded){
        this.teamWait();
        this.teamRanking(); //热卖商品
      }
    })
  }
  goTo(url) {
    this.cp.goto(url);
  }

  // 显隐拼团规则详情
  switchRule() {
    this.ruleState = !this.ruleState;
  }
  teamWait() {
    this.cp.getData('team/teamWait', {
      team_id: this.team_id,
      user_id: this.user_id,
    }).then(
      (t: any) => {
        this.teamUser = t.data.teamUser;
        this.teamInfo = t.data.team_info;
        this.difftime = t.data.team_info.end_time;
        this.timeEnd();

        if (this.cp.isWechat()) {
          this.api.register(this.shareConfig())
        }
      }
    )
  }
  teamRanking() {
    this.cp.getData('team/teamRanking', {
      size: 30,
      page: 1,
      type: 3,
      silent: true
    }).then(
      (t: any) => {
        // console.log(t.data, 'listArr');
      }
    )
  }
  // 倒计时
  timeEnd() {
    let that = this;
    let timer = null;
    timer = setInterval(() => {
      var r = that.difftime - new Date().getTime() / 1e3, i = 0, s: any = 0, d: any = 0, n: any = 0;
      if (r > 0) {
        i = Math.floor(r / 86400);
        s = Math.floor(r / 3600) - 24 * i;
        d = Math.floor(r / 60) - 24 * i * 60 - 60 * s;
        n = Math.floor(r) - 24 * i * 60 * 60 - 60 * s * 60 - 60 * d, s <= 9 && (s = "0" + s);
        d <= 9 && (d = "0" + d), n <= 9 && (n = "0" + n);
        u = s + ":" + d + ":" + n;
      } else {
        var u = "已结束！";
        clearInterval(timer);
      }
      that.difftimeStr = u;
    }, 1e3);
  }

  shareConfig() {
    let msg = this.teamInfo.goods_name, t;
    t = {
      message: msg,
      title: msg,
      pic: this.teamInfo.goods_thumb,
      url: this.cp.getShareUrl("#/collage-progress/" + this.team_id + "/" + this.user_id),
      type:'url'
    }
    return t;
  }
  share() {
    if (this.cp.isWechat()) {
      this.cp.toast("请点击右上角 ··· 进行分享");
    } else if (this.cp.plt.is("cordova")) {
      this.cp.share(this.shareConfig())
    } else
      this.cp.goto({ view: "download" })
  }
}