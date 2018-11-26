import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FootprintPage } from './footprint';
import { ProModule } from '../../components/pro/pro.module';

@NgModule({
  declarations: [
    FootprintPage,
  ],
  imports: [
    IonicPageModule.forChild(FootprintPage),
    ProModule
  ],
})
export class FootprintPageModule {}
