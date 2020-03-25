import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { PagesCameratestPage } from '../pages-cameratest/pages-cameratest'
import { PagesAddpostPage } from '../addpost/pages-addpost';
import { PagesChatPage } from '../pages-chat/pages-chat';
import { PagesNotificationsPage } from '../pages-notifications/pages-notifications';
import { PagesSearchfriendsPage } from '../pages-searchfriends/pages-searchfriends';
import { PagesViewprofilePage } from '../pages-viewprofile/pages-viewprofile';
import { NavController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  testcamera=PagesCameratestPage;
  tab1Root = HomePage;
  addpost = PagesAddpostPage;
  viewprofile = PagesViewprofilePage;
  chat = PagesChatPage;
  notification=PagesNotificationsPage;
  search=PagesSearchfriendsPage
  constructor(public auth: AuthenticationProvider, public nav: NavController) {
  }
  logout() {
    this.auth.logout();
    this.nav.push(MyApp);
  }
}
