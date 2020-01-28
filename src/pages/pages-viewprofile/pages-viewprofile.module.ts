import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagesViewprofilePage } from './pages-viewprofile';

@NgModule({
  declarations: [
    PagesViewprofilePage,
  ],
  imports: [
    IonicPageModule.forChild(PagesViewprofilePage),
  ],
})
export class PagesViewprofilePageModule {}
