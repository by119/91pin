import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'splitPrice',
})
export class SplitPricePipe implements PipeTransform {
  transform(value: string = '', place: string = '') {
    value = value.toString();
    place = place.toString();
    let i = value.indexOf('.');
    return !place || place.toLowerCase() == 'left' ?
      value.slice(0, i == -1 ? undefined : i) :
      value.slice(i + 1 == 0 ? value.length : i)
  }
}
