import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";
import { Keyboard } from '@ionic-native/keyboard';


@IonicPage({
  name: 'after-detail'
})
@Component({
  selector: 'page-after-detail',
  templateUrl: 'after-detail.html',
})
export class AfterDetailPage {
  @ViewChild('form') form;
  fileElem: any;
  formElem: any;
  photos: any = [];        //添加的照片
  url = '';
  orderList: any = {};
  cause = 0;//退款原因
  content = '';//退款问题描述
  content2 = '';//留言
  rec_id = 0;
  credentials = 0; //申请凭证

  constructor(public navCtrl: NavController,
    public cp: CommonProvider,
    public navParams: NavParams,
    public keyboard:Keyboard,
    private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.keyboard.hideFormAccessoryBar(false);
    this.url = '?' + this.navParams.get('apply_return_url').split('?')[1];
    this.formElem = this.form.nativeElement;
    this.fileElem = this.formElem.firstElementChild;
    this.orderApply();
  }

  orderApply() {
    // type：  售后：0   进度：1
    this.cp.getData(this.url, {
      method: 'get',
      H5API: true,
      silent: true
    }).then(
      (t: any) => {
        this.orderList = t;
        this.rec_id = t.return_rec_id;
        let pic = t.return_pic_list;
        for (let i = 0; i < pic.length; i++) {
          this.photos.push(pic[i].pic);
        }
      }
    )
  }
  // 选择退款原因
  selectCause(rec_id, e) {
    this.rec_id = rec_id;
    console.log(rec_id, e, 'rec_id,e');
    this.cp.getData('?m=user&c=refound&a=select_cause', {
      rec_id: rec_id,
      c_id: e,
      H5API: true,
      silent: true
    }).then(
      (t: any) => {
        console.log(t, 'orderapply111')
      }
    )
  }
  // 申请凭证
  chooseCredentials() {
    this.credentials = this.credentials == 0 ? 1 : 0;
  }

  /*图片操作*/
  addImg() {
    console.log('addImg');
    if (this.photos.length == 6) {
      this.showToast('最多上传6张图片', 2000);
    } else
      this.fileElem.click()
  }

  uploadImg(e) {
    console.log(e, this.formElem, 'uploadImg');     // {H5API: true,silent: true}
    var form: any = new FormData(this.formElem);
    form.H5API = true;
    form.silent = 1;
    this.cp.getData('?m=user&c=refound&a=img_return', form).then((result: any) => {
      console.log(result, 'res')
      if (result.length <= 0)
        this.showToast(result.msg, 2000);
      // this.showToast(result.msg.indexOf('大小不符') > 0 ? '图片需小于5M' : result.msg, 2000);
      else {
        // this.photos.push(result);
        this.photos = [];
        for (let i = 0; i < result.length; i++) {
          this.photos.push(result[i].pic);
        }
        console.log(this.photos, 'this.cp.WWW_URL + result.data.name')
      }

    });
    //清空file
    this.fileElem.value = '';
  }

  deleteImg(item) {
    console.log('deleteImg');
    item &&
      this.photos.splice(this.photos.indexOf(item), 1);
  }

  submit() {
    if (this.content == '') {
      this.showToast('请填写问题描述', 2000);
      return false;
    }
    console.log(this.cause, this.rec_id, 'cause')
    this.cp.getData('?m=user&c=refound&a=submit_return', {
      return_rec_id: this.orderList.return_rec_id,
      return_g_id: this.orderList.return_g_id,
      return_g_number: this.orderList.return_g_number,
      return_type: 3,
      parent_id: this.cause,
      goods_number: this.orderList.goods.goods_number,
      return_brief: this.content,
      credentials: this.credentials,
      textfield: '',
      addressee: this.orderList.consignee.consignee,
      mobile: this.orderList.consignee.mobile,
      province_region_id: this.orderList.consignee.province,
      city_region_id: this.orderList.consignee.city,
      district_region_id: this.orderList.consignee.district,
      village_region_id: '',
      region_id: '',
      address_id: this.orderList.consignee.address_id,
      return_address: this.orderList.consignee.address,
      return_remark: this.content2,
      refound_token: '',
      chargeoff_status: this.orderList.order.chargeoff_status,
      street: this.orderList.consignee.street,
      method: 'get',
      H5API: true,
      silent: true
    }).then(
      (t: any) => {
        this.cp.pop();
      }
    )
  }

  goTo(url) {
    this.cp.goto(url)
  }
  // 显示toast
  showToast(tip, time) {
    let toast = this.toastCtrl.create({
      message: tip,
      duration: time,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}