import { Component, Input } from '@angular/core';
import { CommonProvider } from '../../providers/common/common';

@Component({
  selector: 'index-column',
  templateUrl: 'index-column.html'
})
export class IndexColumnComponent {
  
  @Input() columns: any = [];

  constructor(public cp:CommonProvider) {
    
  }

}
