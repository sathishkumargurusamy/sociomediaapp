import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ISubscription } from 'rxjs/Subscription';
import { PostProvider } from '../../providers/post/post';
import { FriendProvider } from '../../providers/friend/friend';
import { PagesViewpostPage } from '../pages-viewpost/pages-viewpost';

@IonicPage()
@Component({
  selector: 'page-pages-notifications',
  templateUrl: 'pages-notifications.html',
})
export class PagesNotificationsPage {
  subscriptionList: ISubscription[] = [];
  public user;
  public username;
  public userid;
  public allUsers;
  public friendList; 
  public fList=[];
  fuList=[];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public postServ: PostProvider,
    public friendServ: FriendProvider) {
      if (localStorage.getItem('currentUser')) {
        this.user = JSON.parse(localStorage.getItem('currentUser'));
      }
      else {
        this.user = JSON.parse(sessionStorage.getItem('currentUser'));
      }
  }

  ionViewDidLoad() {
    for (const user of this.user) {
      this.username = user.username;
      this.userid = user._id;
    }
    this.getallusers();
  }
  getallusers() {
    this.subscriptionList.push(this.postServ.allusers().subscribe(data => {
      this.allUsers = data;
      for (const f of this.allUsers) {
        if (f._id != this.userid) {
          let body = {
            friend1: f._id,
            friend2: this.userid
          }
          this.subscriptionList.push(this.friendServ.getFriendList(body).subscribe(data => {
            this.friendList = data;
            if (this.friendList.length != 0) {
              for(let fl of this.friendList){
                if(fl.status==='0'){
                  this.fuList.push(f);
                  this.fList.push(fl);
                }
              }
            }
          }))
        }
      }
    }));
  }

  acceptFriendRequest(id){
    let body={
      friend1:id,
      friend2:this.userid,
      status:'1'
    }
    this.subscriptionList.push(this.friendServ.updateFriend(body).subscribe(data=>{
      console.log(data);
      this.getallusers();
      this.fList=[]
    }))
  }
  gotoprofile(id) {
    this.navCtrl.push(PagesViewpostPage, {
      id: id
    });
  }
  deleteFriendRequest(friendid){
    let body1={
      friend2:this.userid,
      friend1:friendid
    }
    this.subscriptionList.push(this.friendServ.deleteFriendRequest(body1).subscribe(data=>{
      this.getallusers();
      this.fList=[];
    }))
  }

}
