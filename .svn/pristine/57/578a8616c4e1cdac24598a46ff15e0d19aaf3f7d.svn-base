import {Component, Input, OnInit/*, Output*/} from '@angular/core';
import {CommonProvider} from "../../providers/common/common";

@Component({
  selector: 'good-item',
  templateUrl: 'good-item.html'
})
export class GoodItemComponent implements OnInit  {
  @Input('good') good;
  @Input('type') type=1;

  constructor(
    public cp: CommonProvider,) {
  }

  ngOnInit() {
  }

  goTo(url) {
    this.cp.goto(url);
  }
}
