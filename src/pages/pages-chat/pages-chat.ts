import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { MessageProvider } from '../../providers/message/message';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { PostProvider } from '../../providers/post/post';
import { PagesPersonalchatbubblePage } from '../../pages/pages-personalchatbubble/pages-personalchatbubble';
import { User } from '../../models/user';
import { Message } from '../../models/message';
import { BiometricData } from '../../models/biometric';
import { ISubscription } from "rxjs/Subscription";
import Pusher from 'pusher-js';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';

// import * as jwt_decode from 'jwt-decode';
@IonicPage()
@Component({
  selector: 'page-pages-chat',
  templateUrl: 'pages-chat.html',
})
export class PagesChatPage {
  subscriptionList: ISubscription[] = [];
  public username;
  public unreadMessages = [];
  public userid;
  public fingerPrintValidity = 0;
  public all_messages: Message[];
  public count = 0;
  public pusher;
  public biometricToggle;
  public biometricdata: BiometricData[];
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
  constructor(public navCtrl: NavController,
    public postserv: PostProvider,
    public navParams: NavParams,
    public _chatService: ChatProvider,
    public authServ: AuthenticationProvider,
    public menuCtrl: MenuController,
    private toastController: ToastController,
    private messageService: MessageProvider,
    private fingeraio: FingerprintAIO) {
    // const jwt = JSON.parse(localStorage.getItem('currentUser'));
    // const jwtData = jwt_decode(jwt);
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.pusher = new Pusher('74df637180c0aa9440a4', { cluster: 'ap2', forceTLS: true });
    const unreadmessages_channel = this.pusher.subscribe('message');
    const userstatus_channel = this.pusher.subscribe('user');
    userstatus_channel.bind('user-logged', (data) => {
      if (data) {
        this.getallusers();
      }
    });
    unreadmessages_channel.bind('unreadmessages-count', (data) => {
      if (data) {
        this.getUnreadmessages();
      }
    });
  }
  ionViewDidLoad() {
    this.getallusers();
    this.getUnreadmessages();
  }
  gotouser(friend_id, friend_name) {
    if (this.biometricToggle) {
      this.fingeraio.show({
        clientId: 'Fingerprint-Demo', //Android: Used for encryption. iOS: used for dialogue if no `localizedReason` is given.
        clientSecret: 'o7aoOMYUbyxaD23oFAnJ', //Necessary for Android encrpytion of keys. Use random secret key.
        disableBackup: true,  //Only for Android(optional)
        localizedFallbackTitle: 'Use Pin', //Only for iOS
        localizedReason: 'Please authenticate' //Only for iOS
      })
        .then((result: any) => {
          this.navCtrl.push(PagesPersonalchatbubblePage, {
            friend_id: friend_id,
            friend_name: friend_name
          });
        })
        .catch((error: any) => {
          if (error) {
            if (error.message == 'BIOMETRIC_DISMISSED') {
              this.presentToast("FingerPrint Sensor Closed!");
            }
            else {
              this.presentToast("FingerPrint: " + error.message);
            }
          }
        });
    }
    else {
      this.navCtrl.push(PagesPersonalchatbubblePage, {
        friend_id: friend_id,
        friend_name: friend_name
      });
    }
  }
  toggleoffline() {
    this.toggleoffline1 = !this.toggleoffline1;
  }
  getallusers() {
    this.subscriptionList.push(this.postserv.getallusers().subscribe(data => {
      this.friends = data;
      for (const friend of this.friends) {
        this.unreadMessages[friend._id] = 0;
      }
    },
      error => {
        if (error) {
          console.log("Error getting users!", error);
        }
      }));
  }
  getUnreadmessages() {
    this.subscriptionList.push(this.postserv.getallusers().subscribe(data => {
      this.friends = data;
      for (const friend of this.friends) {
        this.messageService.getallmessage().subscribe(data => {
          this.all_messages = data;
          for (const allmessage of this.all_messages) {
            if (allmessage.senderid == friend._id && allmessage.read == false) {
              this.unreadMessages[friend._id] = this.unreadMessages[friend._id] + 1;
            }
          }
        });
      }
    },
      error => {
        if (error) {
          console.log('Error getting unread messages!', error);
        }
      }));
  }
  ngOnInit() {
    for (const i of this.user) {
      this.username = i.username;
      this.userid = i._id;
    }
    this.getallusers();
    this.getallusers();
    this.getUnreadmessages();
    this.getBiometricData();
  }
  doRefresh(event) {
    setTimeout(() => {
      this.getallusers();
      this.getallusers();
      this.getUnreadmessages();
      event.complete();
    }, 2000);
  }
  ionViewDidLeave() {
    this.segment = 'chat';
    for (const subsceribeMethods of this.subscriptionList) {
      subsceribeMethods.unsubscribe();
    }
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  getBiometricData() {
    this.authServ.getbiometricData(this.userid).subscribe(data => {
      this.biometricdata = data;

      if (this.biometricdata.length != 0) {
        for (const bdata of this.biometricdata) {
          this.biometricToggle = bdata.secure;
        }
      }
      else {
        this.biometricToggle = false;
      }
    })
  }
  setBiometricData() {
    this.authServ.getbiometricData(this.userid).subscribe(data => {
      this.biometricdata = data;
      if (this.biometricdata.length == 0) {
        let postbody = {
          userid: this.userid,
          username: this.username,
          secure: this.biometricToggle
        };
        console.log(postbody);
        this.authServ.setbiometricData(postbody).subscribe(data => {
          if (data) {
            this.getBiometricData();
          }
        });
      }
      else {
        this.fingeraio.show({
          clientId: 'Fingerprint-Demo', //Android: Used for encryption. iOS: used for dialogue if no `localizedReason` is given.
          clientSecret: 'o7aoOMYUbyxaD23oFAnJ', //Necessary for Android encrpytion of keys. Use random secret key.
          disableBackup: true,  //Only for Android(optional)
          localizedFallbackTitle: 'Use Pin', //Only for iOS
          localizedReason: 'Please authenticate' //Only for iOS
        })
          .then((result: any) => {
            for (const bdata of this.biometricdata) {
              let putbody = {
                _id: bdata._id,
                userid: this.userid,
                username: this.username,
                secure: this.biometricToggle
              };
              this.authServ.putbiometricData(putbody).subscribe(data => {
                if (data) {
                  this.getBiometricData();
                }
              });
            }
          })
          .catch((error: any) => {
            this.getBiometricData();
            if (error) {
              console.log(error.message);
              if(error.message=='Too many attempts. Fingerprint sensor disabled.')
              this.presentToast("Fingerprint : Too many attempts.Try again later");
            }
          });
      }
    });
  }
  openSideMenu() {
    this.menuCtrl.enable(true, 'chat');
    this.menuCtrl.toggle('chat');
  }
}