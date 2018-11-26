import {Component, ViewChild, EventEmitter, Input, OnInit, Output, OnChanges} from '@angular/core';
import {CommonProvider} from "../../providers/common/common";

@Component({
  selector: 'spec',
  templateUrl: 'spec.html'
})
export class SpecComponent implements OnInit, OnChanges{
  @ViewChild('spec') spec;
  @Input() goodData: any = {};
  @Output() confirm: any = new EventEmitter();
  @Output() cancel: any = new EventEmitter();

  spec_state: any = 'hide';//选择规格界面
  specList: any = [];
  buyType: any = 'team';
  specSelected: any = [];
  price: any = '';
  number: number = 0;

  constructor(public cp: CommonProvider) {
  }

  ngOnChanges(params){
    /*获取商品规格*/
    if(params.goodData.currentValue.goods_id){
      this.cp.getData('index.php?m=goods&a=getPropertyPrices&goods_id=' + this.goodData.goods_id).then((data: any) => {
        let list = [],
          selected = [];
        for (let key in data) {
          list.push(data[key]);
          selected.push(0);
        }
        this.specList = list;
        this.specSelected = selected;
        list = null;
        selected = null;
      })
    }
  }

  ngOnInit() {
    this.spec = this.spec.nativeElement.parentElement;
    this.spec.style.display = 'none';
  }

  show(type) {
    this.spec.style.display = 'block';
    this.buyType = type;
    this.price = +this.goodData[this.buyType + '_price'];
    //this.specSelected.forEach((item, i) => this.specSelected[i] = 0);
    this.spec_state = 'hidden';
    setTimeout(() => this.spec_state = 'show', 200);
  }

  hide() {
    this.spec_state = 'hidden';
    this.cancel.emit();
    setTimeout(() => (
      this.spec.style.display = 'none',
      this.spec_state = 'hide'
    ), 500);
  }

  toggleSpec(spec, i, j) {
    this.specSelected[i] = j;
    this.price = +this.goodData[this.buyType + '_price'] + +spec.format_price;
    console.log('toggleSpec', this.price);
  }

  modNum(number) {
    number = this.number + number;
    number >= 0 && (this.number = number, number = null);
  }

  Confirm() {
    let {goodData,buyType, price, number,specList, specSelected} = this;
    let spec_selected = [];
    specList.forEach((item, i) =>
      spec_selected.push(item.values[specSelected[i]].id)
    );
    let spec = {
      good:goodData,
      goods_id:goodData.goods_id,
      buyType,
      price,
      number,
      spec:spec_selected
    };
    this.hide();
    this.confirm.emit(spec);
    spec = null;
  }

}
