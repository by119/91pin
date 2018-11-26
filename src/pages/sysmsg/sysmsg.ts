import { Component,ViewChild } from '@angular/core';
import { IonicPage,InfiniteScroll } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';

@IonicPage({
  name : 'sysmsg',
  priority: 'off',
  defaultHistory : ['welcome']
})
@Component({     //装饰器：赋予一个类更丰富的信息（元数据）
  selector: 'page-sysmsg',    //元数据 定义组件的标签名为page-sysmsg  selector为css3选择器 匹配到html中的<page-sysmsg>{sysmsg.html内容在这里}</page-sysmsg>标签
  templateUrl: 'sysmsg.html',  //元数据  定义组件的模板 {{插值}}
})
export class SysmsgPage {   //组件类
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll; 
  //infiniteScroll变量 并且使用@ViewChild装饰器来修饰 子组件的输入接口
  
  items=[];  //成员变量
  res;
  page=0;

  constructor(public cp: CommonProvider) {
  }

  ionViewWillEnter(){
      this.cp.checkLogin().then(loaded=>{
        if(loaded){
          // this.cp.temp.sysmsg_time = 0;
          this.page==0 && this.doInfinite();
        }
      })
  }
//  ionViewDidEnter(){
//    if(this.cp.plt.is("cordova"))
//      this.cp.styleLightContent();
//  }
  doInfinite(){
    this.page++;
    this.cp.getData("sys_msg_user_read/getList", { p: this.page, DGAPI: 1 }).then(n=>{
      this.res=n,this.items=this.items.concat(this.res.data),this.infiniteScroll.complete(),
      Math.ceil(this.res.total/this.res.per_page) <= this.page && this.infiniteScroll.enable(!1)
      setTimeout(()=>{
        Array.prototype.forEach.call(this.cp.getActiveViewCtrl().contentRef().nativeElement.querySelectorAll("a"),n => {
            n.addEventListener("click",n=>{
                if(n.target.title && n.target.title.indexOf("{")===0){
                  this.cp.parseJson(n.target.title.replace(/'/g,'"')).then(j=>{
                    this.cp.goto(j);
                  }).catch(err => {
                    this.cp.toast("链接失效啦，请联系客服");
                  })
                  n.preventDefault();
                }else if(n.target.href){
                  this.cp.plt.is("cordova") && (n.preventDefault(), this.cp.toast('链接有误，请联系管理'));
                }
            })
        })
      },
      300)
    })
  }
}