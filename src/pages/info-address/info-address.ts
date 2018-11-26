import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";
import { clamp } from 'ionic-angular/util/util';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';


import {CityPickerService} from "../../providers/common/CityPickerService";

@IonicPage(
  {
    name: 'info-address',
    priority: 'off'
  }
)
@Component({
  selector: 'page-info-address',
  templateUrl: 'info-address.html',
})
export class InfoAddressPage {
  expire:number = 3600*24;//缓存的地址有效期
  form: FormGroup;
  rules: any = {
    consignee: ['', [Validators.required]],
    mobile: ['', [Validators.required, Validators.pattern('^[1][3,4,5,7,8][0-9]{9}$')]],
    province: ['', [Validators.required]],
    city: ['', [Validators.required]],
    district: ['', [Validators.required]],
    address: ['', [Validators.required]],
    // address_type: ['', [Validators.required]],
    // zipcode: ['', [Validators.pattern('^\\d{6}$')]],
    cityName:[],
  };
  provinces = [];
  cities = [];
  areas = [];
  user_id = '';  //用户id
  pageForm: FormGroup = this.formBuilder.group(this.rules);


  cityData:any[] = [];
  cityName:string = '';

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public cityPickerSev: CityPickerService,
              public navParams: NavParams,
              public cp: CommonProvider,
              public formBuilder: FormBuilder) {
  }

  ionViewDidLoad() {
    let item = this.navParams.data.item;
    if (item) {
      this.getDetail(item);
      /*let { consignee, mobile, address, province, city, district } = item;
      console.log(item);
      this.pageForm.patchValue({
        consignee,
        mobile,
        address,
        province,
        city,
        district
      });*/
    }
    this.initRegions();
    // this.initLocation();
  }

  initLocation() {
    this.cp.getData('region/list',{id:1}).then((t: any) => this.provinces = t);

    let { province, city } = this.pageForm.value;
    if (province) {
      this.getCities(province);
      this.getDistrict(city);
    }

  }

  getCities(province_id, bol = false) {
    //拼接url，访问接口
    this.cp.getData('region/list',{id:province_id}).then((t: any) => {
      //把接受的城市列表赋值到cities
      this.cities = t;
      if (bol) {
        this.pageForm.patchValue({ city: t[0].region_id });
        this.getDistrict(t[0].region_id, true);
      }
    })
  }
  getDistrict(city_id, bol = false) {
    this.cp.getData('region/list',{id:city_id}).then((t: any) => {
      this.areas = t;
      bol &&
        this.pageForm.patchValue({ district: t[0].region_id });
    })

  }

  onSubmit(t) {
    if(this.navParams.data.item)
      t.id = this.navParams.data.item.id;
    this.cp.getData('user/address/'+(t.id?'update':'add'),t).then((res:any)=>{
      if(!res.code){
        this.cp.pop();
      }else {
        console.log('添加地址失败',res);
        this.cp.alert('添加失败！')
      }
    })
  }

  del() {
    let confirm = this.alertCtrl.create({
      title: '是否确认删除',
      buttons: [
        {
          text: '否'
        },
        {
          text: '是',
          handler: () => {
            let address_id = this.navParams.data.item;
            let user_id = 84276;
            let t = {
              address_id,
              user_id
            }
            this.cp.getData("?m=area&a=dropConsignee", t).then((t: any) => {
              if (t.status == 1) {
                this.cp.pop();
              }

            })
          }
        }
      ]
    });
    confirm.present();
  }

  /*-------------*/

  getDetail(item){
    this.cp.getData('user/address/detail',{id:item.id}).then((res:any)=>{
      console.log(res);
      if(!res.code){
        let {address:{
          consignee,
          mobile,
          address,
          province,
          province_id,
          city,
          city_id,
          district,
          district_id,
        }} = res.data;
        this.pageForm.patchValue({
          consignee,
          mobile,
          address,
          province:province_id,
          city:city_id,
          district:district_id,
          cityName:`${province}-${city}-${district}`
        });
      }
    })
  }

  initRegions(){
    this.getRegions().then((regions:any)=>{
      let {province,city,district} = this.pageForm.value;
      console.log({province,city,district});
      console.log(regions);
      this.cityData = regions;
    })
  }

  getRegions() {
    return new Promise((resolve, reject) => {
      this.cp.getCache('Regions').then((res: any) => {
        if (res) {
          resolve(res)
        } else
          this.cp.getData('region/list', {id: 1}).then((res: any) => {
            if (res.code == 0) {
              res.data.map((province, i, arr) => {
                // console.log(provinces,i,arr);
                arrayHandle(province);
                province.children.map((city) => {
                  arrayHandle(city);
                  city.children.map(region => {
                    arrayHandle(region)
                  })
                })
              });
              this.cp.setCache('Regions',res.data,this.expire);
              resolve(res.data)
              // console.log(this.cityData);
              // console.log(res.data);
            } else {
              console.log(res);
            }
            function arrayHandle(region) {
              region.code = region.region_id;
              region.name = region.region_name;
              region.children = region.region;

            }
          })
      })
    })
  }

  cityChange(event){
    let {
      province:{value:province},
      city:{value:city},
      region:{value:district},
    } = event;
    this.pageForm.patchValue({province,city,district});
    // console.log('cityChange',event);
  }

  setCityPickerData(){
/*    this.cityPickerSev.getCitiesData()
      .then( (data:any) => {
        console.log(data);
        this.cp.getCache('cityPickerDefaultValue').then((res:any)=>{
          console.log(res);
          let {province,city_name,district_name} = res;
          let province_name;
          for(let i=0,l=data.length;i<l;i++){
            if(data[i].code==province){
              province_name = data[i].name;
              break;
            }
          }
          this.cityName = `${province_name}-${city_name}-${district_name}`;
        });
        console.log(this.cityName);
        console.log('cityData',data);
        this.cityData = data
      });*/
  }

}
