import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagesCommentModalPage } from './pages-comment-modal';

@NgModule({
  declarations: [
    PagesCommentModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PagesCommentModalPage),
  ],
})
export class PagesCommentModalPageModule {}
