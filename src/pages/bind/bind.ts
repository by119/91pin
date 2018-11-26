import {Component} from '@angular/core';
import {IonicPage, NavParams} from 'ionic-angular';
import {CommonProvider} from '../../providers/common/common';
import {Validators, FormBuilder, FormGroup} from '@angular/forms';

@IonicPage({
  priority: 'off',
  name: 'bind'
})
@Component({
  selector: 'page-bind',
  templateUrl: 'bind.html',
})
export class BindPage {
  pageForm = this.formBuilder.group({
    tel: ["", [Validators.required, Validators.pattern('^[1][3,4,5,7,8][0-9]{9}$')]],
    captcha: ["", [Validators.required, Validators.minLength(4)]],
  });

  constructor(public navParams: NavParams,
              public formBuilder: FormBuilder,
              public cp: CommonProvider) {
  }

  ionViewDidEnter() {
    if (this.cp.plt.is("cordova"))
      this.cp.styleLightContent();
  }

  captcha(t) {
    var u = typeof u == 'undefined' ? 0 : u;
    if (!u) {
      var n, i = this.pageForm.controls.tel;
      if (!i.valid) return void this.cp.toast("手机号填写错误");
      n = i.value,
        u = 60;
      var r = setInterval(() => {
          u--,
            0 == u ? (t.target.innerText = "重新发送", clearInterval(r)) : t.target.innerText = "重新发送(" + u + ")"
        },
        1000);
      this.cp.getData("captcha/index", {
        type: 1,
        tel: n
      }).then((n: any) => {
        this.cp.toast(n.msg),
        n.status || (u = 1)
      })
    }
  }

  sub(t) {
    this.cp.getData("user/account", t).then((n: any) => {
      this.cp.toast(n.msg);
      if (n.status) {
        this.cp.setU(n.data);
        this.cp.pop();
      }
    })
  }
}
