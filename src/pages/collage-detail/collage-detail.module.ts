import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CollageDetailPage } from './collage-detail';

@NgModule({
  declarations: [
    CollageDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CollageDetailPage),
  ],
})
export class CollageDetailPageModule {}
