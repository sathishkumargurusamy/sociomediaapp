import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { User } from '../../models/user';
import { Post } from '../../models/post';
import { Comments } from "../../models/comments";
import { Likes } from '../../models/likes';
import { ToastController } from 'ionic-angular';
import { ISubscription } from "rxjs/Subscription";
import { PagesCommentModalPage } from '../pages-comment-modal/pages-comment-modal';
import { FriendProvider } from '../../providers/friend/friend';
// import * as jwt_decode from 'jwt-decode';
@IonicPage()
@Component({
  selector: 'page-pages-viewpost',
  templateUrl: 'pages-viewpost.html',
})
export class PagesViewpostPage {
  subcriptionList: ISubscription[] = [];
  public post: Post;
  public comments: any = [];
  public dispcomment: Comments;
  public comment;
  public friendList;
  public friendList1;
  public allfriendsList=[];
  public errcomment: any = '';
  public user: User[];
  public likecount: any = [];
  public username: any = '';
  public allikes: Likes[];
  public likes: any = '';
  public userid: any = '';
  public liketoggle = [];
  public thispost: any = '';
  public showcommenttoggle1: any = [];
  public loggeduser;
  public loggeduserid;
  public loggedusername;
  public all_users;
  public proimage;
  public dateOfBirth: any;
  public gender: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public auth: AuthenticationProvider, 
    public friendServ:FriendProvider,
    public postserv: PostProvider,
    public toastController: ToastController) {
  }
  ngOnInit() {
    // const jwt = JSON.parse(localStorage.getItem('currentUser'));
    // const jwtData = jwt_decode(jwt);
    if(localStorage.getItem('currentUser')){
      this.loggeduser = JSON.parse(localStorage.getItem('currentUser'));
    }
    else{
      this.loggeduser = JSON.parse(sessionStorage.getItem('currentUser'));
    }
    for (const i of this.loggeduser) {
      this.loggeduserid = i._id;
      this.loggedusername = i.username;
    }
    this.userid = this.navParams.get('id');
    this.getprofile(this.userid);
    this.getuser(this.userid);
    this.allusers();
    this.getcomment();
    this.alllikes(this.loggeduserid);
  }
  ionViewWillEnter() {
    this.userid = this.navParams.get('id');
    this.getprofile(this.userid);
    this.getuser(this.userid);
    this.getcomment();
    this.alllikes(this.loggeduserid);
  }
  allusers() {
    this.subcriptionList.push(this.postserv.allusers().subscribe(data => {
      this.all_users = data;
      this.getAllFriends(this.all_users);
      for (const all_user of this.all_users) {
        if (all_user._id == this.userid) {
          this.proimage = all_user.profileimage;
          this.dateOfBirth = all_user.dob;
          this.gender = all_user.gender;
        }
      }
    }));
  }
  getuser(id) {
    this.subcriptionList.push(this.postserv.getuser(id).subscribe(data => {
      this.user = data;
      for (const i of this.user) {
        this.username = i.username;
      }
    },
      error => {
        if (error) {
          this.presentToast("Error getting user!!");
        }
      }));
  }
  getAllFriends(users) {
    for (let allusers of users) {
        const body = {
          friend1: this.loggeduserid,
          friend2: allusers._id
        }
        this.subcriptionList.push(this.friendServ.getFriendList(body).subscribe(data => {
          let body2 = {
            friend1: allusers._id,
            friend2: this.loggeduserid
          }
          this.subcriptionList.push(this.friendServ.getFriendList(body2).subscribe(data2 => {
            this.friendList = data;
            this.friendList1 = data2;
            if (this.friendList.length != 0 || this.friendList1.length != 0) {
              console.log(this.friendList, this.friendList1)
              if (this.friendList.length != 0) {
                for (let f of this.friendList) {
                  if (f.status == '1' || f.status == '2')
                    this.allfriendsList.push(allusers)
                }
              }
              else if (this.friendList1.length != 0) {
                for (let f of this.friendList1) {
                  if (f.status == '1' || f.status == '2')
                    this.allfriendsList.push(allusers)
                }
              }
            }
          }))
        }))
    }
  }
  showcommenttoggle(post_id){
    this.navCtrl.push(PagesCommentModalPage,{postid:post_id});
    }
  addlikes(j, uid, pid) {
    this.subcriptionList.push(this.postserv.getthispost(pid).subscribe(data => {
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
        this.subcriptionList.push(this.postserv.updatepost(body).subscribe(data => { this.getprofile(this.userid); }));
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
            userid: this.userid,
            likes: this.likecount[pid]
          };
          this.postserv.updatepost(body).subscribe(data => { this.getprofile(this.userid); });
          this.postserv.deletelikes(body).subscribe(data1 => { });
        }
      }
    }));
  }
  deletePostlike(id) {
    this.subcriptionList.push(this.postserv.deletepostlike(id).subscribe());
  }
  deletePostComment(id) {
    this.subcriptionList.push(this.postserv.deletepostcomment(id).subscribe());
  }
  alllikes(uid) {
    this.subcriptionList.push(this.postserv.getlikes(uid).subscribe(data => {
      this.allikes = data;
      for (const l of this.allikes) {
        this.liketoggle[l.postid] = l.status;
      }
    }));
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  getprofile(userid) {
    this.subcriptionList.push(this.postserv.getmypost(userid).subscribe(data => {
      this.post = data;
    },
      error => {
        if (error) {
          this.presentToast("Error getting profile!!");
        }
      }));
  }
  getcomment() {
    this.subcriptionList.push(this.postserv.getcomment().subscribe(data => {
      if (data) {
        this.dispcomment = data;
      }
    },
      error => {
        if (error) {
          this.presentToast("Error getting comments!!");
        }
      }));
  }
  addcomment(id, userid, j, username) {
    this.subcriptionList.push(this.postserv.addcomment(userid, id, username, this.comments[j]).subscribe(data => {
      this.getcomment();
      this.presentToast('Comment added successfully!');
    }));
  }
  // gotoprofile(id){
  //   this.route.navigateByUrl('/viewprofile/'+id);
  // }
  deletepost(id) {
    this.subcriptionList.push(this.postserv.deletepost(id).subscribe(data => {
      this.getprofile(this.userid);
      this.deletePostComment(id);
      this.deletePostlike(id);
      this.presentToast("Post deleted successfully");
    }));
  }
  deletecomment(id) {
    this.subcriptionList.push(this.postserv.deletecomment(id).subscribe(data => {
      this.getcomment();
      this.presentToast("Comment deleted successfully");
    }));
  }
  doRefresh(event) {
    setTimeout(() => {
      this.getprofile(this.userid);
      this.getuser(this.userid);
      this.allusers();
      this.getcomment();
      this.alllikes(this.loggeduserid);
      event.complete();
    }, 2000);
  }
  ionViewDidLoad() { }
  ionViewDidLeave() {
    for (const subscribedmethods of this.subcriptionList) {
      subscribedmethods.unsubscribe();
    }
  }
}