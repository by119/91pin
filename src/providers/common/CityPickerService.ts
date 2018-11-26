import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CityPickerService {

  constructor(public http: Http) {
    console.log('Hello CityPicker Provider');
  }

  getCitiesData(){
    return this.http.get('http://hongbao.fengsh.cn/api/region/showHierarchy')
      .toPromise()
      .then(res=>res.json(),(err)=>{console.log(err);})
      .catch( err => {
        return Promise.reject(err)
      });
/*
    return new Promise((resolve, reject) => {
      let data = [{
        name:'123',
        code:1,
        children:[
          {
            name:'222',
            code:2,
            children:[

            ]
          }
        ]
      }];
      resolve(data)
    })*/


      /*
    return this.http.get('./assets/data/city-data.json')
      .toPromise()
      .then(response => response.json())
      .catch( err => {
        return Promise.reject(err)
      })*/

  }

}
