import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { PagesAddpostPage } from '../pages/addpost/pages-addpost';
import { PagesViewpostPage } from '../pages/pages-viewpost/pages-viewpost';
import { PagesLoginPage } from '../pages/pages-login/pages-login';
import { PagesViewprofilePage } from '../pages/pages-viewprofile/pages-viewprofile';
import { HttpClientModule } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PostProvider } from '../providers/post/post';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { PagesChatPage } from '../pages/pages-chat/pages-chat';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { ChatProvider } from '../providers/chat/chat';
import { PagesChatbubblePage } from '../pages/pages-chatbubble/pages-chatbubble';
import {PagesEditprofilePage} from '../pages/pages-editprofile/pages-editprofile'
import { PagesPersonalchatbubblePage } from '../pages/pages-personalchatbubble/pages-personalchatbubble';
import { Camera } from '@ionic-native/camera';
const config: SocketIoConfig = { url: 'https://sociomediaapp-server.herokuapp.com', options: {} };
import { DatePipe } from '@angular/common';
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    PagesAddpostPage,
    PagesViewpostPage,
    PagesLoginPage,
    PagesEditprofilePage,
    PagesViewprofilePage,
    PagesChatPage,
    PagesChatbubblePage,
    PagesPersonalchatbubblePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true
    }),
    SocketIoModule.forRoot(config),
    HttpClientModule],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    PagesChatPage,
    PagesLoginPage,
    PagesEditprofilePage,
    PagesAddpostPage,
    PagesViewprofilePage,
    PagesViewpostPage,
    PagesChatbubblePage,
    PagesPersonalchatbubblePage
  ],
  providers: [
    StatusBar,
    DatePipe,
    Camera,
    ChatProvider,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    PostProvider,
    AuthenticationProvider

  ],
  exports: [PagesAddpostPage]
})
export class AppModule {}

