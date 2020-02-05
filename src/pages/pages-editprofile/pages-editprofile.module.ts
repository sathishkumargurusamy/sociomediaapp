import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagesEditprofilePage } from './pages-editprofile';

@NgModule({
  declarations: [
    PagesEditprofilePage,
  ],
  imports: [
    IonicPageModule.forChild(PagesEditprofilePage),
  ],
})
export class PagesEditprofilePageModule {}
