import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PostProvider } from '../../providers/post/post';
/**
 * Generated class for the PagesStoryViewerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-story-viewer',
  templateUrl: 'pages-story-viewer.html',
})
export class PagesStoryViewerPage {
  public storyId;
  public currentStory;
  public storyUsername;
  public storyImage;
  public storyTime;
  public progress = 0;
  public interval
  constructor(public navCtrl: NavController,
    private platform: Platform,
    private postServ: PostProvider,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private navparms: NavParams) {
    this.storyId = this.navparms.get('storyid');
  }
  ngOnInit() {
    this.getStory(this.storyId);
    this.interval = setInterval(() => {
      this.progress = this.progress + 60;
      if (this.progress > 310) {
        clearInterval(this.interval);
        this.navCtrl.pop();
      }
    }, 500);
  }
  ionViewWillEnter() {
    this.getStory(this.storyId);
  }
  getStory(id) {
    this.postServ.getStory(id).subscribe(data => {
      this.currentStory = data;
      this.storyImage = this.currentStory.story;
      this.storyUsername = this.currentStory.username;
      this.storyTime = this.currentStory.time;
    });
  }
  ionViewDidLeave() {
  }

}
