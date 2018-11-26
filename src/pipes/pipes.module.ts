import { NgModule } from '@angular/core';
import { FixedPipe } from './fixed/fixed';
import { SplitPricePipe } from './split-price/split-price';
@NgModule({
	declarations: [
    FixedPipe,
    SplitPricePipe
  ],
	imports: [],
	exports: [
    FixedPipe,
    SplitPricePipe
  ]
})
export class PipesModule {}
