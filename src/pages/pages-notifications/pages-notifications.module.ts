import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PagesNotificationsPage } from './pages-notifications';

@NgModule({
  declarations: [
    PagesNotificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(PagesNotificationsPage),
  ],
})
export class PagesNotificationsPageModule {}
