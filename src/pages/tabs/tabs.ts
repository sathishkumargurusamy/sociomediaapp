import { Component } from '@angular/core';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import { PagesAddpostPage } from '../addpost/pages-addpost';
import { PagesChatPage } from '../pages-chat/pages-chat';
import { PagesViewprofilePage } from '../pages-viewprofile/pages-viewprofile';
import { NavController } from 'ionic-angular';
import { MyApp } from '../../app/app.component';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  addpost = PagesAddpostPage;
  tab3Root = ContactPage;
  viewprofile = PagesViewprofilePage;
  chat = PagesChatPage;

  constructor(public auth: AuthenticationProvider, public nav: NavController) {

  }
  logout() {
    this.auth.logout();
    this.nav.push(MyApp);
  }
}
