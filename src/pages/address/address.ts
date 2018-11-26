import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonProvider} from "../../providers/common/common";

@IonicPage({
  name: 'address'
})
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {
  infoList: any = [];

  callBack:any = !1;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public cp: CommonProvider) {
  }

  ionViewDidLoad() {
    if(this.navParams.data.callBack)
      this.callBack = this.navParams.data.callBack;
  }

  ionViewWillEnter(){
    this.getAddressList();
  }

  getAddressList(){
    this.cp.getData('user/address/list').then((res:any)=>{
      if(!res.code){
        this.infoList = res.data;
      }else{
        console.log('address/list',res);
      }
    })
  }

  choiceDefault(item){
    this.cp.getData('user/address/choice',{id:item.id}).then(res=>{
      this.getAddressList();
    })
  }

  edit(item){
    this.cp.goto({item},'info-address')
  }

  del(item){
    let alert = this.alertCtrl.create({
      title: '提示',
      message: '您确定要移除当前收货地址吗？',
      buttons: ['取消',
        {
          text: '确定',
          handler: () => {
            this.cp.getData('user/address/delete',{id:item.id}).then(res=>{
              this.getAddressList();
            })
          }
        }
      ]
    });
    alert.present();
  }

  choice(item){
    console.log('click');
    if(this.callBack){
      this.callBack(item);
      this.cp.pop();
    }
  }

}
