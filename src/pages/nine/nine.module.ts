import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NinePage } from './nine';

@NgModule({
  declarations: [
    NinePage,
  ],
  imports: [
    IonicPageModule.forChild(NinePage),
  ],
})
export class NinePageModule {}
