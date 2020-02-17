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
// import * as jwt_decode from 'jwt-decode';
// import{AboutPage} from '../about/about';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public post: Post;
  public comments: any = [];
  public dispcomment: Comments;
  public errcomment: any = '';
  public user: User[];
  public likecount: any = [];
  public username: any = '';
  public var: any = [];
  public allikes: Likes[];
  public profileimage = [];
  public likes: any = '';
  public userid: any = '';
  public liketoggle = [];
  public popuptoggle = [];
  public thispost: Post[];
  public now = new Date();
  public allusers;
  public pusher;
  public showcommenttoggle1: any = [];
  commentedPost: any;
  commented_post: Post[];
  likedPost: any;
  receivedmsg:Message;
  liked_post: Post[];
  constructor(public navCtrl: NavController, public app: App, public auth: AuthenticationProvider,
    private menu: MenuController, public postserv: PostProvider, public modalController: ModalController,
    public toastController: ToastController, private platform: Platform,
    public notification: LocalNotifications, statusBar: StatusBar, splashScreen: SplashScreen, ) {
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
        this.postserv.getthispost(this.commentedPost.postid).subscribe(data => {
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
        });
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
        this.postserv.getthispost(this.likedPost.postid).subscribe(data => {
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
        });
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
  }
  alluser() {
    this.postserv.allusers().subscribe(data => {
      this.allusers = data;
      for (const all_users of this.allusers) {
        this.profileimage[all_users._id] = all_users.profileimage;
      }
    });
  }

  ionViewWillEnter() {
    this.getlikes();
    this.getpost();
    this.getcomment();
    this.alluser();
    this.alllikes(this.userid);
  }
  popuptoggle1(j) {
    this.popuptoggle[j] = !this.popuptoggle[j];
  }
  getpost() {
    this.postserv.getpost().subscribe(data => {
      this.post = data;
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

    this.postserv.addcomment(userid, id, username, this.comments[j]).subscribe(data => {
      this.getcomment();
      this.comments[j] = '';
      this.presentToast();
    });
  }
  getcomment() {
    this.postserv.getcomment().subscribe(data => {
      if (data) {
        this.dispcomment = data;
      }
      else {
        this.errcomment = 'Be First to comment this post....'
      }
    });
  }

  deletepost(id, j) {
    this.postserv.deletepost(id).subscribe(data => {
      this.getpost();
      this.delpost_toaster();
      this.deletePostComment(id);
      this.deletePostlike(id);
      this.popuptoggle[j] = !this.popuptoggle[j];
    });

  }
  deletePostlike(id) {
    this.postserv.deletepostlike(id).subscribe();
  }
  deletePostComment(id) {
    this.postserv.deletepostcomment(id).subscribe();
  }
  deletecomment(id) {
    this.postserv.deletecomment(id).subscribe(data => {
      this.getcomment();
      this.delcomment_toaster();
    });
  }
  getlikes() {
    this.postserv.getpost().subscribe(data => {
      this.post = data;
    });
  }
  alllikes(uid) {
    this.postserv.getlikes(uid).subscribe(data => {
      this.allikes = data;
      for (const l of this.allikes) {
        this.liketoggle[l.postid] = l.status;
      }
    });
  }
  addlikes(j, uid, pid, username) {
    this.postserv.getthispost(pid).subscribe(data => {
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
        this.postserv.updatepost(body).subscribe(data => { this.getpost(); });
        let body1 = {
          userid: uid,
          username: this.username,
          postid: pid,
          status: true
        };
        this.postserv.postlikes(body1).subscribe(data1 => { });
      }
      else {
        if (this.likecount[pid] > 0) {
          this.likecount[pid] = this.likecount[pid] - 1;
          let body = {
            _id: pid,
            userid: this.userid,
            likes: this.likecount[pid]
          };
          this.postserv.updatepost(body).subscribe(data => { this.getpost(); });
          this.postserv.deletelikes(body).subscribe(data1 => { });
        }
      }
    });
  }
  showcommenttoggle(j) {
    this.showcommenttoggle1[j] = !this.showcommenttoggle1[j];
  }
  async delpost_toaster() {
    const toast = await this.toastController.create({
      message: 'Post Deleted Successfully',
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  async delcomment_toaster() {
    const toast = await this.toastController.create({
      message: 'Comment Deleted Successfully',
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Comment Added Successfully',
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
    this.auth.setstatus(body).subscribe(data => { });
    this.app.getRootNav().setRoot(MyApp);
  }
  gotoeditprofile() {
    this.navCtrl.push(PagesEditprofilePage);
  }
}