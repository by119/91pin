import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AfterProgressPage } from './after-progress';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [
    AfterProgressPage,
  ],
  imports: [
    IonicPageModule.forChild(AfterProgressPage),
    LazyLoadImageModule,
  ],
})
export class AfterProgressPageModule {}
