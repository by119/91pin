import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArticlePage } from './article';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    ArticlePage,
  ],
  imports: [
    IonicPageModule.forChild(ArticlePage),
  ],
  providers: [
    DatePipe
  ],
})
export class ArticlePageModule {}
