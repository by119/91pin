import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductsPage } from './products';
//import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ProModule } from '../../components/pro/pro.module';

@NgModule({
  declarations: [
    ProductsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductsPage),
//    LazyLoadImageModule,
    ProModule
  ],
})
export class ProductsPageModule {}
