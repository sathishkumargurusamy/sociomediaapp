import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { PagesChatbubblePage } from '../../pages/pages-chatbubble/pages-chatbubble';
import { PostProvider } from '../../providers/post/post';
import { PagesPersonalchatbubblePage } from '../../pages/pages-personalchatbubble/pages-personalchatbubble';
// import * as jwt_decode from 'jwt-decode';
@IonicPage()
@Component({
  selector: 'page-pages-chat',
  templateUrl: 'pages-chat.html',
})
export class PagesChatPage {
  public username;
  public userid;
  public count = 0;
  public user;
  public friends;
  public offcountno; oncountno;
  public offcount: any;
  public oncount: any;
  public toggleoffline1 = false;
  public groupname;
  public segment = 'chat';
  public groupid;
  public groups;
  public interval;
  public room: String;
  public messageText: String;
  public messageArray: Array<{ user: String, message: String }> = [];
  constructor(public navCtrl: NavController, public postserv: PostProvider, public navParams: NavParams, public _chatService: ChatProvider) {
    // const jwt = JSON.parse(localStorage.getItem('currentUser'));
    // const jwtData = jwt_decode(jwt);
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this._chatService.newUserJoined()
      .subscribe(data => {
        this.messageArray.push(data);
        if (data == this.username) {
          this.gotouser(this.username);
        }
      });
    this._chatService.userLeftRoom()
      .subscribe(data => this.messageArray.push(data));

    this._chatService.newMessageReceived()
      .subscribe(data => this.messageArray.push(data));
  }
  ionViewDidLoad() {
    this.interval = setInterval(() => {
      this.getgroups();
      this.getallusers();
    }, 2000);
  }
  gotouser(friend) {
    this.navCtrl.push(PagesPersonalchatbubblePage, {
      room: friend
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
    this.interval = setInterval(() => {
      this.getgroups();
      this.getallusers();
    }, 2000);
  }
  setroom(name, groupid) {
    this.room = name;
    this.groupid = groupid;
  }
  ionViewDidLeave() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.segment = 'chat';
  }
}