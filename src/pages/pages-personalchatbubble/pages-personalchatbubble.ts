import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { ChatProvider } from '../../providers/chat/chat';
import { PostProvider } from '../../providers/post/post';
import * as jwt_decode from 'jwt-decode';

@IonicPage()
@Component({
  selector: 'page-pages-personalchatbubble',
  templateUrl: 'pages-personalchatbubble.html',
})
export class PagesPersonalchatbubblePage {

  public username;
  public userid;
  public user;
  public interval;
  public toggled: boolean = false;
  public messageText: String = '';
  public messageArray: Array<{ user: String, message: String }> = [];
  public defaultmessage: Array<{ user: String, message: String }> = [];
  public defaultmessage1: Array<{ user: String, message: String }> = [];

  constructor(public navCtrl: NavController, public postserv: PostProvider, public navParams: NavParams, 
    private socket: Socket, public _chatService: ChatProvider) {
    const jwt = JSON.parse(localStorage.getItem('currentUser'));
    const jwtData = jwt_decode(jwt);
    this.user = jwtData.user;
    this._chatService.newUserJoined()
      .subscribe(data => {
      this.defaultmessage = [];
        this.defaultmessage1 = [];
        this.defaultmessage.push(data);
      });


    this._chatService.userLeftRoom()
      .subscribe(data => {
      this.defaultmessage1 = [];
        this.defaultmessage = [];
        this.defaultmessage1.push(data);
      });

    this._chatService.newMessageReceived()
      .subscribe(data => {
        this.messageArray.push(data);
      });
  }
  ionViewDidLeave() {
    this.leave();
  }
  ngOnInit() {
    for (const i of this.user) {
      this.username = i.username;
      this.userid = i._id;
    }
    this.join();
  }
  join() {
    this._chatService.joinRoom({ user: this.username, room: this.navParams.get('room') });

  }

  leave() {
    this._chatService.leaveRoom({ user: this.username, room: this.navParams.get('room') });
  }

  sendMessage() {
    this._chatService.sendMessage({ user: this.username, room: this.navParams.get('room'), message: this.messageText });
  }
}
