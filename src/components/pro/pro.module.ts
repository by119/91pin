import {NgModule} from '@angular/core';
import {IonicModule} from "ionic-angular";
import {ProComponent} from "./pro";
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [ProComponent],
  imports:[IonicModule,LazyLoadImageModule,PipesModule],
  exports: [ProComponent],
  providers: [],
})
export class ProModule {}
