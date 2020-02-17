import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { MessageProvider } from '../../providers/message/message';
import { PagesChatbubblePage } from '../../pages/pages-chatbubble/pages-chatbubble';
import { PostProvider } from '../../providers/post/post';
import { PagesPersonalchatbubblePage } from '../../pages/pages-personalchatbubble/pages-personalchatbubble';
import { User } from '../../models/user';
import { Message } from '../../models/message';
// import * as jwt_decode from 'jwt-decode';
@IonicPage()
@Component({
  selector: 'page-pages-chat',
  templateUrl: 'pages-chat.html',
})
export class PagesChatPage {
  public username;
  public unreadMessages;
  public userid;
  public all_messages: Message[];
  public count = 0;
  public user: User[];
  public friends: User[];
  public offcountno; oncountno;
  public offcount: any;
  public oncount: any;
  public toggleoffline1 = false;
  public groupname;
  public segment = 'chat';
  public groupid;
  public groups;
  public room: String;
  public messageText: String;
  public messageArray: Array<{ user: String, message: String }> = [];
  constructor(public navCtrl: NavController, public postserv: PostProvider,
    public navParams: NavParams, public _chatService: ChatProvider, private messageService: MessageProvider) {
    // const jwt = JSON.parse(localStorage.getItem('currentUser'));
    // const jwtData = jwt_decode(jwt);
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this._chatService.newUserJoined()
      .subscribe(data => {
        this.messageArray.push(data);
        if (data == this.username) {
          // this.gotouser(this.username);
        }
      });
    this._chatService.userLeftRoom()
      .subscribe(data => this.messageArray.push(data));

    this._chatService.newMessageReceived()
      .subscribe(data => this.messageArray.push(data));
  }
  ionViewDidLoad() {
    this.getgroups();
    this.getallusers();
    this.getUnreadmessages();
  }
  gotouser(friend_id, friend_name) {
    this.navCtrl.push(PagesPersonalchatbubblePage, {
      friend_id: friend_id,
      friend_name: friend_name
    });
  }
  gotochat() {
    this.navCtrl.push(PagesChatbubblePage, {
      room: this.room, groupid: this.groupid
    });

  }
  toggleoffline() {
    this.toggleoffline1 = !this.toggleoffline1;
  }

  join() {
    this._chatService.joinRoom({ user: this.username, room: this.username });
  }
  getgroups() {
    this.postserv.getgroups().subscribe(data => {
      this.groups = data;
    });

  }
  getallusers() {
    this.postserv.getallusers().subscribe(data => {
      this.friends = data;
    });
  }
  getUnreadmessages() {
    this.postserv.getallusers().subscribe(data => {
      this.friends = data;
    console.log(this.friends);
    for (const friend of this.friends) {
      this.unreadMessages[friend._id]=0;
      this.messageService.getallmessage().subscribe(data => {
        this.all_messages = data;
        for (const allmessage of this.all_messages) {
          if(allmessage.senderid==friend._id){
            if(allmessage.read==false)
            this.unreadMessages[friend._id]=this.unreadMessages[friend._id]+1;
          }
        }
      });
    }
    });
    
  }
  creategroup() {
    let body = {
      username: this.username,
      userid: this.userid,
      groupname: this.groupname
    }
    this.postserv.creategroup(body).subscribe(data => {
      this.getgroups();
    });
  }
  ngOnInit() {
    for (const i of this.user) {
      this.username = i.username;
      this.userid = i._id;
    }
    this.getgroups();
    this.getallusers();
    this.join();
    this.getgroups();
    this.getallusers();
    this.getUnreadmessages();
  }
  setroom(name, groupid) {
    this.room = name;
    this.groupid = groupid;
  }
  ionViewDidLeave() {
    this.segment = 'chat';
  }
}