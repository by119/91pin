import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'fixed',
})

export class FixedPipe implements PipeTransform {
  transform(value: any, digit: number): any {
    if (digit >= 0)
      return parseFloat(value).toFixed(digit);
    else {
      value = value.toString();
      digit = -digit;
      return value.length == digit ? value :
        '0'.repeat(digit - value.length) + value
    }

  }
}
