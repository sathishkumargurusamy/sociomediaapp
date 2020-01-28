import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { ChatProvider } from '../../providers/chat/chat';
import{PagesChatbubblePage} from '../../pages/pages-chatbubble/pages-chatbubble';
import{PostProvider} from '../../providers/post/post';
import{PagesPersonalchatbubblePage} from '../../pages/pages-personalchatbubble/pages-personalchatbubble';

/**
 * Generated class for the PagesChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-chat',
  templateUrl: 'pages-chat.html',
})
export class PagesChatPage {
username;
userid;
count=0;
user;
friends;
offcountno;oncountno;
offcount:any;
oncount:any;
toggleoffline1=false;
groupname;
segment='chat';
groupid;
groups;
interval;
room:String;
messageText:String;
messageArray:Array<{user:String,message:String}> = [];
  constructor(public navCtrl: NavController,public postserv :PostProvider, public navParams: NavParams,private socket: Socket,public _chatService:ChatProvider) {
    this.user=JSON.parse(localStorage.getItem('currentUser'));
    this._chatService.newUserJoined()
      .subscribe(data=> {this.messageArray.push(data);
      if(data==this.username){
this.gotouser(this.username);
      }
      });


      this._chatService.userLeftRoom()
      .subscribe(data=>this.messageArray.push(data));

      this._chatService.newMessageReceived()
      .subscribe(data=>this.messageArray.push(data));
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesChatPage');
    this.interval = setInterval(() => {
      console.log('hi');
      this.getgroups();
      this.getallusers();
     

    }, 2000);
    
  }
  gotouser(friend){
    this.navCtrl.push(PagesPersonalchatbubblePage,{
      room:friend
      });
  }
  gotochat(){
    this.navCtrl.push(PagesChatbubblePage,{
      room:this.room,groupid:this.groupid
      });
    
  }
  toggleoffline(){
    this.toggleoffline1=!this.toggleoffline1;
  }
 
join(){
  this._chatService.joinRoom({user:this.username, room: this.username});
}
  getgroups(){
    this.postserv.getgroups().subscribe(data=>{
      this.groups=data;
    });
    
  }
  getallusers(){
this.postserv.getallusers().subscribe(data=>{
  this.friends=data; 
});
  }
  
  creategroup(){
    let body={
      username:this.username,
      userid:this.userid,
      groupname:this.groupname
    }
    this.postserv.creategroup(body).subscribe(data=>{
      this.getgroups();
    });
  }
  
  ngOnInit(){
   
    for(const i of this.user){
      this.username=i.username;
      this.userid=i._id;
    }
    this.getgroups();
    this.getallusers();
    this.join();
    this.interval = setInterval(() => {
      console.log('hi');
      this.getgroups();
      this.getallusers();
     

    }, 2000);
    
    
  }
 
  setroom(name,groupid){
    this.room=name;
    this.groupid=groupid;
  }
    
  ionViewDidLeave() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.segment='chat';
  }


  
}

  
  
