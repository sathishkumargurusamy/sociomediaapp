import { Component, ViewChild, trigger, transition, style, animate } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { PostProvider } from '../../providers/post/post';
import { MessageProvider } from '../../providers/message/message';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import Pusher from 'pusher-js';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { Content } from 'ionic-angular';
import * as CryptoJS from 'crypto-js';
import { PagesCameratestPage } from '../../pages/pages-cameratest/pages-cameratest';
// import * as jwt_decode from 'jwt-decode';
@IonicPage()
@Component({
  selector: 'page-pages-personalchatbubble',
  templateUrl: 'pages-personalchatbubble.html'
})
export class PagesPersonalchatbubblePage {
  @ViewChild(Content)
  content: Content;
  public username;
  public userid;
  public user;
  public smessages;
  public biometricToggle;
  public fmessages;
  public count = 0;
  public friend_id;
  public friend_name;
  public receivedmsg;
  public toggled: boolean = false;
  public messageText: String = '';
  public pusher;
  public all_users;
  public lastseenstatus;
  public unreadMessages = 0;
  public myprofile_pic;
  public friendprofile_pic;
  public messageArray: Array<{ user: String, message: String, time: any }> = [];
  public sentmessage: Array<{ user: String, message: String, time: any }> = [];
  public defaultmessage1: Array<{ user: String, message: String }> = [];
  public allmessage;
  public toggle: boolean = false;
  picture: any;

  constructor(public navCtrl: NavController,
    public postserv: PostProvider,
    public authServ: AuthenticationProvider,
    public navParams: NavParams,
    public _chatService: ChatProvider,
    public notification: LocalNotifications,
    public menuCtrl: MenuController,
    public msgsrv: MessageProvider) {
    // const jwt = JSON.parse(localStorage.getItem('currentUser'));
    // const jwtData = jwt_decode(jwt);
    this.pusher = new Pusher('74df637180c0aa9440a4', { cluster: 'ap2', forceTLS: true });
    if (localStorage.getItem('currentUser')) {
      this.user = JSON.parse(localStorage.getItem('currentUser'));
    }
    else {
      this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    }
    const messages_channel = this.pusher.subscribe('message');
    const lastseen_channel = this.pusher.subscribe('lastseen');
    // messages_channel.bind('message-received', (data) => {
    //   if (data) {
    //     this.allmessage = data;
    //     this.messageArray = [];
    //     for (const all_message of this.allmessage) {
    //       if (all_message.senderid === this.userid && all_message.friendid === this.friend_id) {
    //         this.messageArray.push(all_message);
    //         console.log(data);
    //         this.scrolldown();
    //       }
    //       if (all_message.senderid === this.friend_id && all_message.friendid === this.userid) {
    //         this.messageArray.push(all_message);
    //         console.log(data);
    //         this.scrolldown();
    //       }
    //     }
    //   }
    // });
    messages_channel.bind('message-sent', (data) => {
      if (data) {
        this.receivedmsg = data;
        if (this.receivedmsg.senderid === this.userid && this.receivedmsg.friendid === this.friend_id) {
          this.receivedmsg.message = CryptoJS.AES.decrypt(this.receivedmsg.message.trim(), this.friend_id.trim()).toString(CryptoJS.enc.Utf8);
          this.getmessage();
          this.scrolldown();
        }
        if (this.receivedmsg.senderid === this.friend_id && this.receivedmsg.friendid === this.userid) {
          this.receivedmsg.message = CryptoJS.AES.decrypt(this.receivedmsg.message.trim(), this.userid.trim()).toString(CryptoJS.enc.Utf8);
          if (this.receivedmsg.read == false) {
            let body = {
              _id: this.receivedmsg._id,
              read: !this.receivedmsg.read
            };
            this.msgsrv.setreadstatus(body).subscribe(data => { this.getmessage(); });
          }

          this.scrolldown();
          this.notification.schedule({
            id: 1,
            text: this.receivedmsg.sendername + ' : ' + this.receivedmsg.message,
            data: { secret: "key" }
          });
        }
      }
    });
    lastseen_channel.bind('lastseen_status', (data) => {
      this.getLastSeenStatus();
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
    this.friend_id = '';
    this.userid = '';
  }
  openCamera() {
    this.navCtrl.push(PagesCameratestPage);
  }
  handleSelection(event) {
    this.messageText += event.char;
  }
  getprofilepic() {
    this.postserv.getallusers().subscribe(data => {
      this.all_users = data;
      for (const alluser of this.all_users) {
        if (alluser._id == this.userid) {
          this.myprofile_pic = alluser.profileimage;
        }
        if (alluser._id == this.friend_id) {
          this.friendprofile_pic = alluser.profileimage;
        }
      }
    },
      error => {
        if (error) {
          console.log('Error displaying profile picture', error);
        }
      });
  }
  scrolldown() {
    if (this.content._scroll) {
      setTimeout(() => {
        if (this.content.scrollToBottom) {
          this.content.scrollToBottom();
        }
      },400)
    }
  }
  ngOnInit() {
    // this.biometricToggle=this.getbiometrictoggle();
    for (const i of this.user) {
      this.username = i.username;
      this.userid = i._id;
    }
    this.friend_id = this.navParams.get('friend_id');
    this.friend_name = this.navParams.get('friend_name');
    this.getprofilepic();
    this.getmessage();
    this.scrolldown()
  }
  sendmessage() {
    let body = {
      senderid: this.userid,
      sendername: this.username,
      message: CryptoJS.AES.encrypt(this.messageText.trim(), this.friend_id.trim()).toString(),
      friendid: this.friend_id,
      friendname: this.friend_name,
      read: false
    };
    this.msgsrv.sendmessasge(body).subscribe(data => {

    });
    this.messageText = '';
    this.getmessage();
  }
  onFocus() {
    this.content.resize();
    this.scrolldown();
  }
  getmessage() {
    this.msgsrv.getallmessage().subscribe(data => {
      if (data) {
        this.messageArray = [];
        this.allmessage = data;
        for (const all_message of this.allmessage) {
          if (all_message.senderid === this.userid && all_message.friendid === this.friend_id) {
            all_message.message = CryptoJS.AES.decrypt(all_message.message.trim(), this.friend_id.trim()).toString(CryptoJS.enc.Utf8);
            this.messageArray.push(all_message);
            // this.scrolldown();
          }
          if (all_message.senderid === this.friend_id && all_message.friendid === this.userid) {
            all_message.message = CryptoJS.AES.decrypt(all_message.message.trim(), this.userid.trim()).toString(CryptoJS.enc.Utf8);
            if (all_message.read == false) {
              let body = {
                _id: all_message._id,
                read: !all_message.read
              };
              this.msgsrv.setreadstatus(body).subscribe(data => { });
            }
            this.messageArray.push(all_message);
            // this.scrolldown();
          }
        }
        this.scrolldown();
      }
    },
      error => {
        if (error) {
          console.log("Error finding messages", error);
        }
      });
  }
  getLastSeenStatus() {
    this.msgsrv.getlastseen(this.friend_name).subscribe(data => {
      for (const lastseenData of data) {
        this.lastseenstatus = lastseenData.lastseen;
      }
    });
  }
  ionViewWillEnter() {
    this.picture = this.navParams.get('picture');
    if (this.picture) {
    }
    this.getprofilepic();
    this.getmessage();
    this.getLastSeenStatus();
  }
}
