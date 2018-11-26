import {Component, ViewChild} from '@angular/core';
import {ActionSheetController, IonicPage} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {CommonProvider} from "../../providers/common/common";

@IonicPage({
  name: 'user-info',
  defaultHistory: ['center']
})
@Component({
  selector: 'page-user-info',
  templateUrl: 'user-info.html',
})
export class UserInfoPage {
  @ViewChild('form') form;
  fileElem: any;
  formElem: any;

  userInfo: any = {};
  pageForm: FormGroup = this.formBuilder.group({
    nick_name: ['', []],
    sex: ['', []],
    // tel: ['', [Validators.required, Validators.pattern('^[1][3,4,5,7,8][0-9]{9}$')]],
    birthday: ['', []],
  });


  constructor(public formBuilder: FormBuilder,
              public actionSheetCtrl: ActionSheetController,
              public cp: CommonProvider,) {
  }

  ionViewDidLoad() {
    this.formElem = this.form.nativeElement;
    this.fileElem = this.formElem.firstElementChild;
  }

  ionViewWillEnter() {
    this.cp.checkLogin().then(res => {
      if (!res) return;
      let u = this.cp.u;
      this.userInfo = JSON.parse(JSON.stringify(this.cp.u));
      let {nick_name, sex, birthday} = this.userInfo;
      birthday = parseInt(birthday)?birthday:'';
      this.pageForm.patchValue({nick_name, sex, birthday});
      this.userInfo.birthday = +u.birthday ? u.birthday : '';
    });
  }

  imgClick() {
    let actionSheet = this.actionSheetCtrl.create({
      title: '更换头像',
      buttons: [
        {
          text: '上传头像',
          role: 'destructive',
          handler: () => {
            this.fileElem.click();
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

  uploadImg() {
    let formData: any = new FormData(this.formElem);
    formData.H5API = !0;

    this.cp.getData('?m=user&c=profile&a=changeheader', formData).then((res:any) => {
      let {error,msg,path:user_picture} = res;
      this.cp.toast(msg)
      if(!error){
        this.userInfo.user_picture = user_picture;
        this.cp.setU({user_picture})
      }

    });
    //清空file
    this.fileElem.value = '';
  }

  bind() {
    this.cp.goto('bind');
  }

  submit(t=this.pageForm.value) {
    t.H5API = true;
    // let data = this.pageForm.value,
    this.cp.getData('?m=user&c=profile&a=editprofile',t).then((res:any)=>{
      console.log(res);
      if(res.sex)
        res.sex = res.sex=='男'?1:2;
      this.pageForm.patchValue({res})
      this.cp.setU(res)
    })
  }

}
