import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import { ModalController } from 'ionic-angular';
import { PagesAddpostPage } from '../addpost/pages-addpost';
import { PagesEditprofilePage } from '../pages-editprofile/pages-editprofile';
import { ToastController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { MyApp } from '../../app/app.component';
import { PagesViewpostPage } from '../pages-viewpost/pages-viewpost';
import Pusher from 'pusher-js'
import { LocalNotifications } from '@ionic-native/local-notifications';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { User } from '../../models/user';
import { Post } from '../../models/post';
import { Comments } from "../../models/comments";
import { Likes } from '../../models/likes';
import { Message } from '../../models/message';
import { Story } from '../../models/story';
import { ISubscription } from "rxjs/Subscription";
import * as jwt_decode from 'jwt-decode';
import { PagesStoryViewerPage } from '../../pages/pages-story-viewer/pages-story-viewer';
import { ActionSheetController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
// import{AboutPage} from '../about/about';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  subscriptionList: ISubscription[] = [];
  public post: Post;
  public comments: any = [];
  public dispcomment: Comments;
  public errcomment: any = '';
  public user: User[];
  public myStoryImage;
  public likecount: any = [];
  public username: any = '';
  public var: any = [];
  public disabled = true;
  public allikes: Likes[];
  public profileimage = [];
  public likes: any = '';
  public userid: any = '';
  public liketoggle = [];
  public popuptoggle = [];
  public thispost: Post[];
  public now = new Date();
  public myStoryId;
  public allusers;
  public pusher;
  public story: Story[];
  public actionSheet: any;
  public showcommenttoggle1: any = [];
  commentedPost: any;
  commented_post: Post[];
  likedPost: any;
  receivedmsg: Message;
  liked_post: Post[];
  constructor(public navCtrl: NavController, public app: App, public auth: AuthenticationProvider,
    private menu: MenuController, public postserv: PostProvider, public modalController: ModalController,
    public toastController: ToastController, private platform: Platform,
    public notification: LocalNotifications, statusBar: StatusBar, splashScreen: SplashScreen,
    public actionSheetCtrl: ActionSheetController, public camera: Camera) {
    this.platform.ready().then(() => {
      statusBar.backgroundColorByHexString('#483d8b');
      splashScreen.hide();
    });
    // const jwt = JSON.parse(localStorage.getItem('currentUser'));
    // const jwtData = jwt_decode(jwt);
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.pusher = new Pusher('74df637180c0aa9440a4', { cluster: 'ap2', forceTLS: true });
    const post_channel = this.pusher.subscribe('posts');
    const comments_channel = this.pusher.subscribe('comments');
    const likes_channel = this.pusher.subscribe('likes');
    const story_channel = this.pusher.subscribe('story');
    const messages_channel = this.pusher.subscribe('message');
    post_channel.bind('post-created', (data) => {
      if (data) {
        this.getpost();
      }
    });
    post_channel.bind('post-deleted', (data) => {
      if (data) {
        this.getpost();
      }
    });
    comments_channel.bind('comment-created', (data) => {
      if (data) {
        this.getcomment();
        this.commentedPost = data;
        this.subscriptionList.push(this.postserv.getthispost(this.commentedPost.postid).subscribe(data => {
          this.commented_post = data;
          for (const commentedpost of this.commented_post) {
            if (commentedpost.userid == this.userid) {
              this.notification.schedule({
                id: 1,
                text: this.commentedPost.username + ' has commented your post!',
                data: { secret: "key" }
              });
            }
          }
        },
          error => {
            if (error) {
              this.presentToast("Error loading post!!");
            }
          }));
      }
    });
    comments_channel.bind('comment-deleted', (data) => {
      if (data) {
        this.getcomment();
      }
    });
    likes_channel.bind('likes-added', (data) => {
      if (data) {
        this.getpost();
        this.likedPost = data;
        this.subscriptionList.push(this.postserv.getthispost(this.likedPost.postid).subscribe(data => {
          this.liked_post = data;
          for (const likedpost of this.liked_post) {
            if (likedpost.userid == this.userid) {
              this.notification.schedule({
                id: 1,
                text: this.likedPost.username + ' has liked your post!',
                data: { secret: "key" }
              });
            }
          }
        }));
      }
    });
    likes_channel.bind('likes-removed', (data) => {
      if (data) {
        this.getpost();
      }
    });
    messages_channel.bind('message-sent', (data) => {
      if (data) {
        this.receivedmsg = data;
        if (this.receivedmsg.senderid != this.userid && this.receivedmsg.friendid === this.userid) {
          this.notification.schedule({
            id: 1,
            text: this.receivedmsg.sendername + ' :' + this.receivedmsg.message,
            data: { secret: "key" }
          });
        }
      }
    });
    story_channel.bind('story-added', (data) => {
      if (data) {
        this.getAllStory();
      }
    });
  }
  menutoggle() {
    this.menu.enable(false, 'myprofile');
    this.menu.enable(false, 'addpost');
    this.menu.enable(true, 'home');
    this.menu.toggle('home');
  }
  ngOnInit() {
    this.alluser();
    for (const i of this.user) {
      this.username = i.username;
      this.userid = i._id;
    }
    this.getlikes();
    this.getpost();
    this.getcomment();
    this.alluser();
    this.alllikes(this.userid);
    this.getAllStory();
  }
  alluser() {
    this.subscriptionList.push(this.postserv.allusers().subscribe(data => {
      this.allusers = data;
      for (const all_users of this.allusers) {
        this.profileimage[all_users._id] = all_users.profileimage;
      }
    }));
  }

  ionViewWillEnter() {
    this.getlikes();
    this.getpost();
    this.getcomment();
    this.alluser();
    this.alllikes(this.userid);
    this.getAllStory();
  }
  popuptoggle1(j) {
    this.popuptoggle[j] = !this.popuptoggle[j];
  }
  getpost() {
    this.postserv.getpost().subscribe(data => {
      this.post = data;
    },
      error => {
        if (error) {
          this.presentToast("Error loading post!!");
        }
      });
  }
  addpost() {
    this.navCtrl.push(PagesAddpostPage);
  }
  gotoprofile(id) {
    this.navCtrl.push(PagesViewpostPage, {
      id: id
    }, { animate: true, direction: 'left' });

  }
  addcomment(id, userid, j, username) {

    this.subscriptionList.push(this.postserv.addcomment(userid, id, username, this.comments[j]).subscribe(data => {
      this.getcomment();
      this.comments[j] = '';
      this.presentToast('Comment Added Successfully!');
    }));
  }
  getcomment() {
    this.subscriptionList.push(this.postserv.getcomment().subscribe(data => {
      if (data) {
        this.dispcomment = data;
      }
      else {
        this.errcomment = 'Be First to comment this post....'
      }
    },
      error => {
        if (error) {
          this.presentToast("Error loading comment!!");
        }
      }));
  }

  deletepost(id, j) {
    this.subscriptionList.push(this.postserv.deletepost(id).subscribe(data => {
      this.getpost();
      this.presentToast('Post deleted successfully!!');
      this.deletePostComment(id);
      this.deletePostlike(id);
      this.popuptoggle[j] = !this.popuptoggle[j];
    }));

  }
  deletePostlike(id) {
    this.subscriptionList.push(this.postserv.deletepostlike(id).subscribe());
  }
  deletePostComment(id) {
    this.subscriptionList.push(this.postserv.deletepostcomment(id).subscribe());
  }
  deletecomment(id) {
    this.subscriptionList.push(this.postserv.deletecomment(id).subscribe(data => {
      this.getcomment();
      this.presentToast("Comment deleted successfully!!");
    }));
  }
  getlikes() {
    this.subscriptionList.push(this.postserv.getpost().subscribe(data => {
      this.post = data;
    },
      error => {
        if (error) {
          this.presentToast("Error loading likes for the post!!");
        }
      }));
  }
  alllikes(uid) {
    this.subscriptionList.push(this.postserv.getlikes(uid).subscribe(data => {
      this.allikes = data;
      for (const l of this.allikes) {
        this.liketoggle[l.postid] = l.status;
      }
    },
      error => {
        if (error) {
          this.presentToast("Error loading likes!!");
        }
      }));
  }
  addlikes(j, uid, pid, username) {
    this.subscriptionList.push(this.postserv.getthispost(pid).subscribe(data => {
      this.thispost = data;
      for (const p of this.thispost) {
        this.likecount[pid] = p.likes;
      }
      this.liketoggle[pid] = !this.liketoggle[pid];
      if (this.liketoggle[pid]) {
        this.likecount[pid] = this.likecount[pid] + 1;
        let body = {
          _id: pid,
          likes: this.likecount[pid]
        };
        this.subscriptionList.push(this.postserv.updatepost(body).subscribe(data => { this.getpost(); }));
        let body1 = {
          userid: uid,
          username: this.username,
          postid: pid,
          status: true
        };
        this.subscriptionList.push(this.postserv.postlikes(body1).subscribe(data1 => { }));
      }
      else {
        if (this.likecount[pid] > 0) {
          this.likecount[pid] = this.likecount[pid] - 1;
          let body = {
            _id: pid,
            userid: this.userid,
            likes: this.likecount[pid]
          };
          this.subscriptionList.push(this.postserv.updatepost(body).subscribe(data => { this.getpost(); }));
          this.subscriptionList.push(this.postserv.deletelikes(body).subscribe(data1 => { }));
        }
      }
    }));
  }
  showcommenttoggle(j) {
    this.showcommenttoggle1[j] = !this.showcommenttoggle1[j];
  }
  showStory(id) {
    this.navCtrl.push(PagesStoryViewerPage, {
      storyid: id
    }, { animate: true, direction: 'left' });
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  gotoaddpost() {
    this.navCtrl.push(PagesAddpostPage);

  }
  logout() {
    this.auth.logout();
    let body = {
      "id": this.userid,
      "status": 0
    }
    this.subscriptionList.push(this.auth.setstatus(body).subscribe(data => { }));
    this.app.getRootNav().setRoot(MyApp);
  }
  gotoeditprofile() {
    this.navCtrl.push(PagesEditprofilePage);
  }
  addStory() {
    let body = {
      "username": this.username,
      "userid": this.userid,
      "story": this.myStoryImage
    };
    this.postserv.addStory(body).subscribe(data => { console.log(data) });
  }
  getAllStory() {
    this.postserv.getAllStory().subscribe(data => {
      this.story = data;
      for (const mystory of this.story) {
        if (mystory.userid == this.userid) {
          this.myStoryImage = mystory.story;
          this.myStoryId = mystory._id;
        }
      }
    });
  }
  openActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Story',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            this.opencamera();
          }
        },
        {
          text: 'Gallery',
          handler: () => {
            this.AccessGallery();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }
  opencamera() {
    this.camera.getPicture({

      targetWidth: 1200,

      targetHeight: 1800,

      correctOrientation: true,

      sourceType: this.camera.PictureSourceType.CAMERA,

      destinationType: this.camera.DestinationType.DATA_URL

    }).then((imageData) => {

      this.myStoryImage = 'data:image/jpeg;base64,' + imageData;
      this.addStory();

    }, (err) => {

      console.log(err);

    });
  }
  AccessGallery() {

    this.camera.getPicture({

      targetWidth: 1200,

      targetHeight: 1800,

      correctOrientation: true,

      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,

      destinationType: this.camera.DestinationType.DATA_URL

    }).then((imageData) => {

      this.myStoryImage = 'data:image/jpeg;base64,' + imageData;
      this.addStory();

    }, (err) => {

      console.log(err);

    });
  }
  doRefresh(event) {
    setTimeout(() => {
      this.getlikes();
      this.getpost();
      this.getcomment();
      this.alluser();
      this.alllikes(this.userid);
      this.getAllStory();
      event.complete();
    }, 2000);
  }
  ionViewDidLeave() {
    for (const subscribedmethods of this.subscriptionList) {
      subscribedmethods.unsubscribe();
    }
  }
}