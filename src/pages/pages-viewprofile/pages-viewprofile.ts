import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import { ToastController, App } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { MyApp } from '../../app/app.component';
import * as jwt_decode from 'jwt-decode';

@IonicPage()
@Component({
  selector: 'page-pages-viewprofile',
  templateUrl: 'pages-viewprofile.html',
})
export class PagesViewprofilePage {

  public post: any;
  public comments: any = [];
  public dispcomment: any = '';
  public comment;
  public errcomment: any = '';
  public user;
  public likecount: any = [];
  public username: any = '';
  public allikes;
  public likes: any = '';
  public userid: any = '';
  public interval;
  public liketoggle = [];
  public thispost: any = '';
  public showcommenttoggle1: any = [];
  constructor(public navCtrl: NavController, public app: App, public auth: AuthenticationProvider, private menu: MenuController, public toastController: ToastController, public navParams: NavParams, public postserv: PostProvider) {
    const jwt = JSON.parse(localStorage.getItem('currentUser'));
    const jwtData = jwt_decode(jwt);
    this.user = jwtData.user;
  }
  menutoggle() {
    this.menu.enable(false, 'home');
    this.menu.enable(false, 'addpost');
    this.menu.enable(true, 'myprofile');
    this.menu.toggle('myprofile');
  }
  ngOnInit() {
    for (const i of this.user) {
      this.username = i.username;
      this.userid = i._id;
    }
    this.interval = setInterval(() => {
      this.getmypost(this.userid);
      this.getcomment();
      this.alllikes(this.userid);
    }, 8000);
  }
  ionViewWillEnter() {
    this.getmypost(this.userid);
    this.getcomment();
    this.alllikes(this.userid);
  }
  addlikes(j, uid, pid) {
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
        this.postserv.updatepost(body).subscribe(data => { this.getmypost(this.userid); });
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
            userid: this.post.userid,
            username: this.post.username,
            post: this.post.post,
            likes: this.likecount[pid]
          };
          this.postserv.updatepost(body).subscribe(data => { this.getmypost(this.userid); });
          this.postserv.deletelikes(this.userid).subscribe(data1 => { });
        }
      }
    });
  }
  getmypost(userid) {
    this.postserv.getmypost(userid).subscribe(data => {
      this.post = data;
    });
  }
  getcomment() {
    this.postserv.getcomment().subscribe(data => {
      if (data) {
        this.dispcomment = data;
      }
    });
  }
  addcomment(id, userid, j, username) {
    this.postserv.addcomment(userid, id, username, this.comments[j]).subscribe(data => {
      this.getcomment();
      this.presentToast('Comment Added Successfully!!');
    });
    this.comments[j] = '';
  }
  // gotoprofile(id){
  //   this.route.navigateByUrl('/viewprofile/'+id);

  // }
  deletepost(id) {
    this.postserv.deletepost(id).subscribe(data => {
      this.getmypost(this.userid);
      this.presentToast('Post deleted successfully!!..');
    });
  }
  alllikes(uid) {
    this.postserv.getlikes(uid).subscribe(data => {
    this.allikes = data;
      for (let l of this.allikes) {
        this.liketoggle[l.postid] = l.status;
      }
    });
  }
  deletecomment(id) {
    this.postserv.deletecomment(id).subscribe(data => {
      this.getcomment();
      this.presentToast('Comment deleted successfully!!..')
    });
  }
  showcommenttoggle(j) {
    this.showcommenttoggle1[j] = !this.showcommenttoggle1[j];
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  logout() {
    this.auth.logout();
    this.app.getRootNav().setRoot(MyApp);
  }
}
