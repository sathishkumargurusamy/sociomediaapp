import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import { ModalController } from 'ionic-angular';
import { PagesAddpostPage } from '../addpost/pages-addpost';
import {PagesEditprofilePage} from '../pages-editprofile/pages-editprofile';
import { ToastController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { MyApp } from '../../app/app.component';
import { PagesViewpostPage } from '../pages-viewpost/pages-viewpost';
import { DatePipe } from '@angular/common';
// import * as jwt_decode from 'jwt-decode';
// import{AboutPage} from '../about/about';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public post;
  public comments: any = [];
  public dispcomment: any = '';
  public comment;
  public errcomment: any = '';
  public user;
  public likecount: any = [];
  public username: any = '';
  public var: any = [];
  public interval;
  public allikes;
  public profileimage=[];
  public likes: any = '';
  public userid: any = '';
  public liketoggle = [];
  public popuptoggle = [];
  public thispost: any = '';
  public now=new Date();
  public allusers;
  public currenttime=this.datePipe.transform(this.now, 'h');
  public showcommenttoggle1: any = [];
  constructor(public navCtrl: NavController, public app: App, public auth: AuthenticationProvider, 
    private menu: MenuController, public postserv: PostProvider, public modalController: ModalController, 
    public toastController: ToastController,private datePipe: DatePipe) {
    // const jwt = JSON.parse(localStorage.getItem('currentUser'));
    // const jwtData = jwt_decode(jwt);
    this.user=JSON.parse(localStorage.getItem('currentUser'));

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

    this.interval = setInterval(() => {
      this.getlikes();
      this.getpost();
      this.getcomment();
      this.alluser();
      this.alllikes(this.userid);
    }, 8000);
  }
alluser(){
  this.postserv.allusers().subscribe(data=>{
    this.allusers=data;
    for(const all_users of this.allusers){
      this.profileimage[all_users._id]=all_users.profileimage;
    }

  })
}
  ionViewWillEnter() {
    this.getlikes();
    this.getpost();
    this.getcomment();
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
        this.comment = this.dispcomment.length;
      }
      else {
        this.errcomment = 'Be First to comment this post....'
      }

    });

  }
  deletepost(id, j) {
    this.postserv.deletepost(id).subscribe(data => {

      this.getpost();
      this.delpost();
      this.popuptoggle[j] = !this.popuptoggle[j];
    });

  }
  deletecomment(id) {
    this.postserv.deletecomment(id).subscribe(data => {
      this.getcomment();
      this.delcomment();
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
        this.postserv.postlikes(body1).subscribe(data1 => {});
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
          this.postserv.updatepost(body).subscribe(data => { this.getpost(); });
          this.postserv.deletelikes(this.userid).subscribe(data1 => {});
        }
      }
    });
  }
  showcommenttoggle(j) {
    this.showcommenttoggle1[j] = !this.showcommenttoggle1[j];
  }
  async delpost() {
    const toast = await this.toastController.create({
      message: 'Post Deleted Successfully',
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  async delcomment() {
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
      "status": "0"
    }
    this.auth.setstatus(body).subscribe(data => { });
    this.app.getRootNav().setRoot(MyApp);
  }
  gotoeditprofile(){
    this.navCtrl.push(PagesEditprofilePage);
  }
}