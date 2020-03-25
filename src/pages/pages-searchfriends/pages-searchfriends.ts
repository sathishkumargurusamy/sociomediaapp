import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ISubscription } from 'rxjs/Subscription';
import { PostProvider } from '../../providers/post/post';
import { FriendProvider } from '../../providers/friend/friend';
import { PagesViewpostPage } from '../pages-viewpost/pages-viewpost';

@IonicPage()
@Component({
  selector: 'page-pages-searchfriends',
  templateUrl: 'pages-searchfriends.html',
})
export class PagesSearchfriendsPage {
  subscriptionList: ISubscription[] = [];
  public user;
  public username;
  public userid;
  public allUsers;
  public friendList;
  public fList=[];
  public rList=[];
  public ruList=[];
  public friendList1;
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
  ngOnInit() {
    this.getallusers();
  }
  ionViewDidLoad() {
    for (const user of this.user) {
      this.username = user.username;
      this.userid = user._id;
    }
  }
  getallusers() {
    
    this.subscriptionList.push(this.postServ.allusers().subscribe(data => {
      this.allUsers = data;
      for (const f of this.allUsers) {
        if (f._id != this.userid) {
          let body = {
            friend1: this.userid,
            friend2: f._id
          }
          
          this.subscriptionList.push(this.friendServ.getFriendList(body).subscribe(data => {
            let body2 = {
              friend1: f._id,
              friend2: this.userid
            }
            this.subscriptionList.push(this.friendServ.getFriendList(body2).subscribe(data2 => {
            this.friendList = data;
            this.friendList1=data2;
            if (this.friendList.length == 0 && this.friendList1.length==0) {
              this.fList.push(f)
            }
            else{
              if(this.friendList.length==0){
                for(let fl of this.friendList1){
                  this.ruList.push(f)
                  this.rList.push(fl)
                }
              }
              else if(this.friendList1.length==0){
                for(let fl of this.friendList){
                  this.ruList.push(f)
                  this.rList.push(fl)
              }
              }
              else{
                this.ruList=[]
                this.rList=[]
              }
            }
          }));
          }))
        }
      }
    }));
  }
addFriend(friendid){
  let body1={
    friend2:friendid,
    friend1:this.userid,
    status:'0'
  }
  this.subscriptionList.push(this.friendServ.addFriend(body1).subscribe(data=>{
    this.getallusers();
    this.ruList=[]
    this.fList=[]
    this.rList=[]
  }))
}
gotoprofile(id) {
  console.log('hi')
  this.navCtrl.push(PagesViewpostPage, {
    id: id
  });
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
    this.ruList=[]
    this.fList=[];
    this.rList=[];
  }))
}
deleteFriendRequest(friendid){
  let body1={
    friend2:friendid,
    friend1:this.userid
  }
  this.subscriptionList.push(this.friendServ.deleteFriendRequest(body1).subscribe(data=>{
    this.getallusers();
    this.ruList=[]
    this.fList=[];
    this.rList=[];
  }))
}

}
