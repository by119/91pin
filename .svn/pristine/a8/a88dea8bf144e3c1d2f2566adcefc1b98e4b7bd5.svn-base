import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule, enableProdMode } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import {CommonProvider} from "../providers/common/common";
import { BackButtonService } from "../providers/common/backButtonService";
import { WechatApi } from "../providers/common/wechatApi";

import {IonicStorageModule} from "@ionic/storage";
import {CityPickerService} from "../providers/common/CityPickerService";
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { Network } from '@ionic-native/network';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { ManUpModule, ManUpService, TRANSLATE_SERVICE } from 'ionic-manup';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AppVersion } from '@ionic-native/app-version';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';
import { Keyboard } from '@ionic-native/keyboard';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { Deeplinks } from '@ionic-native/deeplinks';
import { AppAvailability } from '@ionic-native/app-availability';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Clipboard } from '@ionic-native/clipboard';
import { Toast } from '@ionic-native/toast';
import { JPush } from '@jiguang-ionic/jpush';

enableProdMode();
//由于ios的cordova-plugin-ionic-webview插件 cors 的问题 暂时采用远程的json  
export function translateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)?'http://api.maoxuankj.com/api/version/translate/':'./assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    MyApp,
    // HomePage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    LazyLoadImageModule,
    IonicModule.forRoot(MyApp,{
      mode:'ios',
      backButtonText: '', // 配置返回按钮的文字
      tabsHideOnSubPages: true //隐藏子页面tabs
    }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateLoader,
        deps: [HttpClient]
      }
    }),
    ManUpModule.forRoot({url: 'http://api.maoxuankj.com/api/version', externalTranslations: true}),
    IonicStorageModule.forRoot(/*{driverOrder: ['sqlite', 'websql', 'indexeddb']}*/)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // HomePage
  ],
  providers: [
    CityPickerService,
    BackButtonService,
    WechatApi,
    CommonProvider,
    JPush,
    StatusBar,
    SplashScreen,
    Network,
    OpenNativeSettings,
    AppAvailability,
    AppVersion,
    ManUpService,
    Clipboard,
    Toast,
    ThemeableBrowser,
    Keyboard,
    StreamingMedia,
    PhotoLibrary,
    SocialSharing,
    Deeplinks,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: TRANSLATE_SERVICE, useClass: TranslateService},
  ]
})
export class AppModule {}
