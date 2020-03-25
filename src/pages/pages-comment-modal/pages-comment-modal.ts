import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Content } from 'ionic-angular';
import { ISubscription } from 'rxjs/Subscription';
import { PostProvider } from '../../providers/post/post';

@IonicPage()
@Component({
  selector: 'page-pages-comment-modal',
  templateUrl: 'pages-comment-modal.html',
})
export class PagesCommentModalPage {
  @ViewChild(Content)
  content: Content;
  public ht = 70;
  subscriptionList: ISubscription[] = [];
  public dispcomment;
  public commentcount = 0;
  public postid;
  public profileimage = [];
  public commentText;
  public user: any;
  public username;
  public allusers;
  public userid;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public postserv: PostProvider,
    private navparms: NavParams,
    public toastController: ToastController
  ) {
    if (localStorage.getItem('currentUser')) {
      this.user = JSON.parse(localStorage.getItem('currentUser'));
    }
    else {
      this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    }
    this.postid = this.navParams.get('postid');
  }

  alluser() {
    this.subscriptionList.push(this.postserv.allusers().subscribe(data => {
      this.allusers = data;
      for (const all_users of this.allusers) {
        this.profileimage[all_users._id] = all_users.profileimage;
      }
    }));
  }

  ionViewDidLoad() {
    for (const i of this.user) {
      this.username = i.username;
      this.userid = i._id;
    }
    this.getcomment();
    this.alluser();
  }

  getcomment() {
    this.commentcount = 0;
    this.subscriptionList.push(this.postserv.getcomment().subscribe(data => {
      if (data) {
        this.dispcomment = data;
        for (const c of this.dispcomment) {
          if (c.postid == this.postid) {
            this.commentcount = this.commentcount + 1;
          }
        }
      }
    },
      error => {
        if (error) {
          // this.presentToast("Check Your internet connection!");
        }
      }));
  }

  addcomment() {
    this.subscriptionList.push(this.postserv.addcomment(this.userid, this.postid, this.username, this.commentText).subscribe(data => {
      this.getcomment();
      this.commentText = '';
      this.scrolldown();
      // this.presentToast('Comment Added Successfully!',2000);
    }));
  }

  deletecomment(id) {
    this.subscriptionList.push(this.postserv.deletecomment(id).subscribe(data => {
      this.getcomment();
      this.presentToast("Comment deleted successfully!!", 2000);
    }));
  }

  scrolldown() {
    if (this.content._scroll) {
      setTimeout(() => {
        if (this.content.scrollToBottom) {
          this.content.scrollToBottom();
        }
      }, 400)
    }
  }

  async presentToast(msg, duration) {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration,
      position: 'top'
    });
    toast.present();
  }

  goBack() {
    this.navCtrl.pop();
  }

  showTextarea() {
    this.ht = 130;
  }

  hideTextarea() {
    this.ht = 70;
  }

}
