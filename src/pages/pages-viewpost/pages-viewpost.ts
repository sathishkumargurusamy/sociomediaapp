import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
// import * as jwt_decode from 'jwt-decode';

@IonicPage()
@Component({
  selector: 'page-pages-viewpost',
  templateUrl: 'pages-viewpost.html',
})
export class PagesViewpostPage {
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
  public liketoggle = [];
  public thispost: any = '';
  public interval;
  public showcommenttoggle1: any = [];
  public loggeduser;
  public loggeduserid;
  public loggedusername;
  public all_users;
  public proimage;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthenticationProvider, public postserv: PostProvider) {
  }
  ngOnInit() {
    // const jwt = JSON.parse(localStorage.getItem('currentUser'));
    // const jwtData = jwt_decode(jwt);
    this.loggeduser = JSON.parse(localStorage.getItem('currentUser'));
    for (const i of this.loggeduser) {
      this.loggeduserid = i._id;
      this.loggedusername = i.username;
    }
    this.userid = this.navParams.get('id');
    this.getprofile(this.userid);
    this.getuser(this.userid);
    this.allusers();
    this.interval = setInterval(() => {
      this.getcomment();
      this.alllikes(this.loggeduserid);
    }, 8000);
  }
  ionViewWillEnter() {
    this.userid = this.navParams.get('id');
    this.getprofile(this.userid);
    this.getuser(this.userid);
    this.getcomment();
    this.allusers();
    this.alllikes(this.loggeduserid);
  }
allusers(){
  this.postserv.allusers().subscribe(data=>{
this.all_users=data;
for(const all_user of this.all_users){
  if(all_user._id==this.userid){
    this.proimage=all_user.profileimage;
  }
}
  });
}
  getuser(id) {
    this.postserv.getuser(id).subscribe(data => {
      this.user = data;
      for (const i of this.user) {
        this.username = i.username;
      }
    });
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
        this.postserv.updatepost(body).subscribe(data => { this.getprofile(this.userid); });
        let body1 = {
          userid: this.loggeduserid,
          username: this.loggedusername,
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
          this.postserv.updatepost(body).subscribe(data => { this.getprofile(this.userid); });
          this.postserv.deletelikes(this.userid).subscribe(data1 => { });
        }
      }
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
  getprofile(userid) {
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
    });
  }
  // gotoprofile(id){
  //   this.route.navigateByUrl('/viewprofile/'+id);
  // }
  deletepost(id) {
    this.postserv.deletepost(id).subscribe(data => {
      this.getprofile(this.userid);
    });
  }
  deletecomment(id) {
    this.postserv.deletecomment(id).subscribe(data => {
      this.getcomment();
    });
  }
  showcommenttoggle(j) {
    this.showcommenttoggle1[j] = !this.showcommenttoggle1[j];
  }
  ionViewDidLoad() {}
}