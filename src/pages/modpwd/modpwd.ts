import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {Validators, FormBuilder,FormGroup } from '@angular/forms';
import { CommonProvider } from '../../providers/common/common';

@IonicPage({
  priority: 'off',
  name : 'modpwd'
})
@Component({
  selector: 'page-modpwd',
  templateUrl: 'modpwd.html',
})
export class ModpwdPage {
  pageForm = this.formBuilder.group({
      org_pwd: ["", [Validators.required, Validators.minLength(6)]],
      pwd: ["", [Validators.required, Validators.minLength(6)]],
      confirm_pwd: ["", [Validators.required, Validators.minLength(6)]]
  }, {validator: this.matchingPasswords('pwd', 'confirm_pwd')})
  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  constructor(public formBuilder:FormBuilder, public cp: CommonProvider) {
  }

  ionViewWillEnter(){
    this.cp.checkLogin().then(loaded=>{
    })
  }
  sub() {
      this.cp.getData("user/mod", this.pageForm.value).then((n:any) => {
          n.status ? (this.cp.setU({}), this.cp.toast(n.msg), this.cp.gotoRoot()) : this.cp.toast(n.msg)
      })
  }
}
