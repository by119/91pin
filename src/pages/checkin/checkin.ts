import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';

@IonicPage({
  priority: 'off',
  name : 'checkin',
  defaultHistory: ['welcome']
})
@Component({
  selector: 'page-checkin',
  templateUrl: 'checkin.html',
})
export class CheckinPage {
  dayOfTheWeek = ['周一','周二','周三','周四','周五','周六','周日'];
  week = 0;
  index;
  remedyIndex;
  rewards = [[],[],[],[],[],[],[],[]];
  reward:any = {};
  checkins = [];
  numNotEnough = [];
  show = 0;
  requestCount = 0;
  
  constructor(public cp: CommonProvider) {
    
  }

  ionViewWillEnter(){
    this.cp.checkLogin().then(loaded=>{
      if(loaded){
        this.week = new Date().getDay();
        this.week = this.week == 0 ? 7 : this.week;
        this.cp.getData('checkin_reward/getlist',{DGAPI:1}).then((r:any)=>{
          this.rewards = r;
          this.requestCount++;
        })
        this.cp.getData('user_action_log/checkinLog',{start_time:'week',DGAPI:1}).then((r:any)=>{
          this.checkins = r.checkins;
          this.numNotEnough = r.num_not_enough;
          this.requestCount++;
        })
      }
    })
  }

  checkin(index){
    if(this.requestCount != 2) return this.cp.toast('加载失败，请重试'), this.cp.pop();
    
    this.index = index;
    this.reward = this.rewards[index];
    
    if(this.checkins.indexOf(index) != -1){ //已经签到过
      if(this.numNotEnough.indexOf(index) != -1)
        this.cp.toast('未抢到，下次请早咯');
      else
        this.goto(1);
    }else if(this.week == index + 1 || index == this.remedyIndex || index == 7){ //今日/执行补打卡/连续签到7天的大奖
      if(index == 7 && this.checkins.length < 7)
        return this.cp.toast('连续签到未满7天');
      this.cp.getData(index == 7 ? 'checkin_reward/continiouslyCheckinReward' : 'user_action_log/checkin', {checkin_reward: this.reward,DGAPI:1}).then((r:any)=>{
        if(r.status){
          this.checkins.push(index);
          if(r.data.errno == 1)
            this.cp.toast('抢光了，明天早点来个'), this.numNotEnough.push(index)
          else
            this.show = 1;
        }else
          this.cp.toast(r.msg);
      })
    }else if(this.week > index && this.checkins.indexOf(index) == -1){ //提示补打卡
      this.reward = {reward:{name:'0.2元补打卡，赢连续打卡大奖', remark:{intro: '补打卡不能领当日奖励喔', btn_text : '补打卡'}}}
      this.show = 3;
    }else{ //之后的
      this.show = 2;
    }
  }

  toggle(){
    this.cp.setSettings();
  }

  suc(){
    this.checkins.push(this.index);
  }

  btnClick(){
    if(this.show == 1)
      this.goto();
    else if(this.show == 3)
      this.cp.buy({
        id: 1,
        real_order_id: this.index
      },()=>{this.suc()},'/checkin')
    this.show = 0;
  }

  goto(checked = 0){
//    let _this = this; //view 可能是 eval (默认编译器 就会把this编译成_this所以这里不需要重复设定)
    if(this.reward.reward && this.reward.reward.remark && this.reward.reward.remark.view == 'pay'){
      if(checked){
        //检查的api  看看到底买没买
        if(this.reward.reward.remark.check){
          this.cp.getData(this.reward.reward.remark.check,Object.assign({DGAPI:1},this.reward.reward.remark)).then((r:any)=>{
            if(r.status){ //已达到限购数量
              if(this.reward.reward.remark.view2){
                this.reward.reward.remark.view = this.reward.reward.remark.view2; //查看所购买的
              }
              this.cp.goto(this.reward.reward.remark);
            }else
              this.cp.buy(this.reward.reward.remark,()=>{this.cp.toast('付款成功，并奖励已发放到账户')},'/checkin');
          })
        }else
          this.cp.toast('已抢光')
      }else
        this.cp.buy(this.reward.reward.remark,()=>{this.cp.toast('付款成功，并奖励已发放到账户')},'/checkin');
    }else if(this.reward.reward && this.reward.reward.remark && this.reward.reward.remark.view == 'detail'){
      //够拼 需要用到extra
      this.reward.reward.remark.extra = Object.assign({}, this.reward.reward.remark);
      this.cp.gotoDetail(this.reward.reward.remark);
    }else
      this.cp.goto(this.reward.reward ? this.reward.reward.remark : {view:'money'});
  }

  close(){
    this.show = 0;
  }
}