import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ManUpService } from 'ionic-manup';
import { TranslateService } from '@ngx-translate/core';
import { CommonProvider } from '../providers/common/common';
import { Network } from '@ionic-native/network';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = 'welcome';
  alert;

  constructor(splashScreen: SplashScreen, manup: ManUpService, cp: CommonProvider, network: Network, openNativeSettings: OpenNativeSettings, translate: TranslateService) {
    cp.plt.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if(cp.plt.is("cordova")){
        setTimeout(()=>{splashScreen.hide()},600);
        if(network.type == 'none')
          return cp.init().then(()=>{
            cp.temp.no_network = 1;
            cp.prompt('网络提示','当前无网络','重新加载',()=>{
              if(network.type == 'none')
                return cp.toast('无网络'),false;
              else
                cp.temp.no_network = 0;
            },'网络设置',()=>{
              return openNativeSettings.open('wifi'),false;
            });
          })
        
        translate.setDefaultLang('zh');
        manup.validate().then(() => {
            //进来就表示 没更新 或 选择后面再更新
            //实际由于插件bug 点后面再更新的不会进来 暂时这样写着 后面插件正常了删掉本条注释即可 反正没进来也没影响
            cp.temp.checking_update = 0;
        },() => {
            console.log("manup error")
        })
      }
      
      network.onDisconnect().subscribe(() => {
        if(!this.alert){
          this.alert = true;
          //延时300毫秒 再次判断状态 如果还是没网就提示
          setTimeout(()=>{
            if(network.type == 'none'){
              this.alert = cp.alert("网络已断开");
              this.alert.onDidDismiss(()=>{
                this.alert = null;
              });
            }else
              this.alert = false;
          },300);
        }
      })
    })
  }
}
