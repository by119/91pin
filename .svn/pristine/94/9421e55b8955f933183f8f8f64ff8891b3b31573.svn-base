import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {CommonProvider} from "../../providers/common/common";

@IonicPage({
  name: 'nine',
  priority: 'off'
})
@Component({
  selector: 'page-nine',
  templateUrl: 'nine.html',
})
export class NinePage {
   navList:any[]= [{id:0,title:'推荐',content:'推荐列表'},{id:1,title:'美食特产',content:'美食列表'},{id:2,title:'水果生鲜',content:'水果列表'},{id:3,title:'推荐',content:'推荐列表'},{id:4,title:'美食特产',content:'美食列表'},{id:5,title:'水果生鲜',content:'水果列表'},{id:6,title:'水果生鲜',content:'水果列表'},{id:7,title:'推荐',content:'推荐列表'},{id:8,title:'美食特产',content:'美食列表'},{id:9,title:'水果生鲜',content:'水果列表'}];

  pet: string = "0";
  slides = [
    {
      title: "Welcome to the Docs!",
      description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
      image: "assets/imgs/card-saopaolo.png",
    },
    {
      title: "What is Ionic?",
      description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
      image: "assets/imgs/card-saopaolo.png",
    },
    {
      title: "What is Ionic Cloud?",
      description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
      image: "assets/imgs/avatar.png",
    }
  ];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cp: CommonProvider,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NinePage');
  }
  getItems(ev: any) {
    const val = ev.target.value;
    if (val && val.trim() != '') {
      console.log(val);
    }
  }
  
}
