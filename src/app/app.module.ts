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
import { PagesEditprofilePage } from '../pages/pages-editprofile/pages-editprofile'
import { PagesPersonalchatbubblePage } from '../pages/pages-personalchatbubble/pages-personalchatbubble';
import { PagesStoryViewerPage } from '../pages/pages-story-viewer/pages-story-viewer';
import { Camera } from '@ionic-native/camera';
const config: SocketIoConfig = { url: 'https://sociomediaapp-server.herokuapp.com', options: {} };
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { DatePipe } from '@angular/common';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { MessageProvider } from '../providers/message/message';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { EmojiPickerModule } from 'ionic-emoji-picker';
import { DatePicker } from '@ionic-native/date-picker';
import { ModalController } from 'ionic-angular';
import {TimeAgoPipe} from 'time-ago-pipe';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { IonicSwipeAllModule } from 'ionic-swipe-all';
import { LongPressModule } from 'ionic-long-press';
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
    PagesStoryViewerPage,
    TimeAgoPipe,
    PagesChatbubblePage,
    PagesPersonalchatbubblePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true
    }),
    SocketIoModule.forRoot(config),
    HttpClientModule,
    IonicSwipeAllModule,
    LongPressModule,
    EmojiPickerModule.forRoot(),
    IonicImageViewerModule],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    PagesStoryViewerPage,
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
    FingerprintAIO,
    Camera,
    ModalController,
    DatePicker,
    PhotoViewer,
    ChatProvider,
    LocalNotifications,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    PostProvider,
    AuthenticationProvider,
    MessageProvider

  ],
  exports: [PagesAddpostPage,PagesStoryViewerPage]
})
export class AppModule { }

