import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagesChatPage } from './pages-chat';

@NgModule({
  declarations: [
    PagesChatPage,
  ],
  imports: [
    IonicPageModule.forChild(PagesChatPage),
  ],
})
export class PagesChatPageModule {}
