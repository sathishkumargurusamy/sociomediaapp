import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { PostProvider } from '../../providers/post/post';
import { MessageProvider } from '../../providers/message/message';
import Pusher from 'pusher-js';

// import * as jwt_decode from 'jwt-decode';

@IonicPage()
@Component({
  selector: 'page-pages-personalchatbubble',
  templateUrl: 'pages-personalchatbubble.html',
})
export class PagesPersonalchatbubblePage {

  public username;
  public userid;
  public user;
  public smessages;
  public fmessages;
  public count = 0;
  public friend_id;
  public friend_name;
  public receivedmsg;
  public toggled: boolean = false;
  public messageText: String = '';
  public pusher;
  public messageArray: Array<{ user: String, message: String, time: any }> = [];
  public sentmessage: Array<{ user: String, message: String, time: any }> = [];
  public defaultmessage1: Array<{ user: String, message: String }> = [];
  public allmessage;

  constructor(public navCtrl: NavController, public postserv: PostProvider, public navParams: NavParams,
    public _chatService: ChatProvider,
    public msgsrv: MessageProvider) {
    // const jwt = JSON.parse(localStorage.getItem('currentUser'));
    // const jwtData = jwt_decode(jwt);
    this.pusher = new Pusher('74df637180c0aa9440a4', { cluster: 'ap2', forceTLS: true });
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    const messages_channel = this.pusher.subscribe('message');
    messages_channel.bind('message-received', (data) => {
      if (data) {
        this.allmessage = data;
        this.messageArray = [];
        for (const all_message of this.allmessage) {
          if (all_message.senderid === this.userid && all_message.friendid === this.friend_id) {
            this.messageArray.push(all_message);
          }
          if (all_message.senderid === this.friend_id && all_message.friendid === this.userid) {
            this.messageArray.push(all_message);
          }
        }
      }
    });
    messages_channel.bind('message-sent', (data) => {
      if (data) {
        this.receivedmsg = data;
        if (this.receivedmsg.senderid === this.userid && this.receivedmsg.friendid === this.friend_id) {
          this.messageArray.push(this.receivedmsg);
        }
        if (this.receivedmsg.senderid === this.friend_id && this.receivedmsg.friendid === this.userid) {
          this.messageArray.push(this.receivedmsg);
        }
      }
    });
    // this._chatService.newUserJoined()
    //   .subscribe(data => {
    //   this.defaultmessage = [];
    //     this.defaultmessage1 = [];
    //     this.defaultmessage.push(data);
    //   });


    // this._chatService.userLeftRoom()
    //   .subscribe(data => {
    //   this.defaultmessage1 = [];
    //     this.defaultmessage = [];
    //     this.defaultmessage1.push(data);
    //   });

    // this._chatService.newMessageReceived()
    //   .subscribe(data => {
    //     this.messageArray.push(data);
    //   });
  }
  ionViewDidLeave() {
    // this.leave();
  }
  ngOnInit() {
    for (const i of this.user) {
      this.username = i.username;
      this.userid = i._id;
    }
    this.friend_id = this.navParams.get('friend_id');
    this.friend_name = this.navParams.get('friend_name');
    this.getmessage();
  }
  sendmessage() {
    let body = {
      senderid: this.userid,
      sendername: this.username,
      message: this.messageText,
      friendid: this.friend_id,
      friendname: this.friend_name
    };
    this.msgsrv.sendmessasge(body).subscribe(data => {
    });
  }
  getmessage() {
    this.msgsrv.getallmessage().subscribe(data => { });
  }
  ionViewWillEnter() {
    this.getmessage();
  }

  // join() {
  //   this._chatService.joinRoom({ user: this.username, room: this.navParams.get('room') });

  // }

  // leave() {
  //   this._chatService.leaveRoom({ user: this.username, room: this.navParams.get('room') });
  // }

  // sendMessage() {
  //   this._chatService.sendMessage({ user: this.username, room: this.navParams.get('room'), message: this.messageText });
  // }
}
