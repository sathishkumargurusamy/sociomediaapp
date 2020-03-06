import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { MessageProvider } from '../../providers/message/message';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { PostProvider } from '../../providers/post/post';
import { PagesPersonalchatbubblePage } from '../../pages/pages-personalchatbubble/pages-personalchatbubble';
import { User } from '../../models/user';
import { Message } from '../../models/message';
import { LastseenData } from '../../models/lastseen'
import { BiometricData } from '../../models/biometric';
import { ISubscription } from "rxjs/Subscription";
import Pusher from 'pusher-js';
import { Platform } from 'ionic-angular';
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
  public toChat:boolean;
  public segment = 'chat';
  public groupid;
  public groups;
  public lastseenid;
  public allLastSeendata:LastseenData[];
  public lastSeenData:LastseenData[];
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
    private fingeraio: FingerprintAIO,
    public platform:Platform) {
    // const jwt = JSON.parse(localStorage.getItem('currentUser'));
    // const jwtData = jwt_decode(jwt);
    platform.pause.subscribe(() => {
      this.setLastSeenStatus(new Date())
    });
    platform.resume.subscribe(()=>{
      this.setLastSeenStatus('Online')
    });
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.pusher = new Pusher('74df637180c0aa9440a4', { cluster: 'ap2', forceTLS: true });
    const unreadmessages_channel = this.pusher.subscribe('message');
    const userstatus_channel = this.pusher.subscribe('user');
    const lastseen_channel=this.pusher.subscribe('lastseen');
    lastseen_channel.bind('lastseen_status',(data)=>{
      this.getalllastseendata();
    });
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
  ngOnInit() {
    for (const i of this.user) {
      this.username = i.username;
      this.userid = i._id;
    }
    this.getallusers();
    this.getallusers();
    this.getUnreadmessages();
    this.getBiometricData();
    this.setLastSeenStatus('Online');
    this.getalllastseendata();
  }
  ionViewWillEnter(){
    this.setLastSeenStatus('Online');
    this.getalllastseendata();
  }
  gotouser(friend_id, friend_name) {
    this.toChat=true;
    if (this.biometricToggle) {
      this.fingeraio.show({
        clientId: 'Fingerprint-Demo',
        clientSecret: 'o7aoOMYUbyxaD23oFAnJ',
        disableBackup: true,
        localizedFallbackTitle: 'Use Pin',
        localizedReason: 'Please authenticate'
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
  getalllastseendata(){
    this.subscriptionList.push(this.messageService.getalllastseendata().subscribe(data=>
      {
        this.allLastSeendata=data;
      }
      ));
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

  doRefresh(event) {
    setTimeout(() => {
      this.getallusers();
      this.getallusers();
      this.getUnreadmessages();
      event.complete();
    }, 2000);
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
        this.fingeraio.show({
          clientId: 'Fingerprint-Demo', //Android: Used for encryption. iOS: used for dialogue if no `localizedReason` is given.
          clientSecret: 'o7aoOMYUbyxaD23oFAnJ', //Necessary for Android encrpytion of keys. Use random secret key.
          disableBackup: true,  //Only for Android(optional)
          localizedFallbackTitle: 'Use Pin', //Only for iOS
          localizedReason: 'Please authenticate' //Only for iOS
        })
          .then((result: any) => {
              let postbody = {
                userid: this.userid,
                username: this.username,
                secure: this.biometricToggle
              };
              this.authServ.setbiometricData(postbody).subscribe(data => {
                if (data) {
                  this.getBiometricData();
                }
              });
          })
          .catch((error: any) => {
            this.getBiometricData();
            if (error) {
              console.log(error.message);
              if (error.message == 'Too many attempts. Fingerprint sensor disabled.')
                this.presentToast("Fingerprint : Too many attempts.Try again later");
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
              if (error.message == 'Too many attempts. Fingerprint sensor disabled.')
                this.presentToast("Fingerprint : Too many attempts.Try again later");
            }
          });
      }
    });
  }

  setLastSeenStatus(status){
    this.subscriptionList.push(this.messageService.getlastseen(this.username).subscribe(data=>{
      for(const lastseenData of data){
        this.lastseenid=lastseenData._id;
      }
      const body={
        id:this.lastseenid,
        username:this.username,
        lastseen:status
      }
      this.subscriptionList.push(this.messageService.putlastseen(body).subscribe());
    }));
  }
  openSideMenu() {
    this.menuCtrl.enable(true, 'chat');
    this.menuCtrl.toggle('chat');
  }
  ionViewDidLeave() {
    this.segment = 'chat';
    for (const subsceribeMethods of this.subscriptionList) {
      subsceribeMethods.unsubscribe();
    }
    if(!this.toChat){
      this.setLastSeenStatus(new Date());
    }
    else{
      this.toChat=false;
    }
    
  }
}