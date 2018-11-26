import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssessDetailPage } from './assess-detail';

@NgModule({
  declarations: [
    AssessDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(AssessDetailPage),
  ],
})
export class AssessDetailPageModule {}
