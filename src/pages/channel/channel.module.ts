import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChannelPage } from './channel';
import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    ChannelPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ChannelPage),
  ],
})
export class ChannelPageModule {}
