import { Component, trigger, transition, style, animate } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { FriendProvider } from '../providers/friend/friend';
import { MessageProvider } from '../providers/message/message';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { TabsPage } from '../pages/tabs/tabs';
import { first } from 'rxjs/operators';
import { ISubscription } from "rxjs/Subscription";
import { AlertController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import Pusher from 'pusher-js'
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  bannerImageheight = 0;
  subscriptionList: ISubscription[] = [];
  public disp: boolean;
  public username: any;
  public registrationCode;
  public validUsername: boolean;
  public validEmail: boolean;
  public password: any;
  public dispreg: boolean = true;
  public displogin: boolean;
  public fname: any;
  public lname: any;
  public bannerImageHt = 260;
  public mgTop = 5;
  public uname: any;
  public scaleDeg = 1;
  public pass: any = '';
  public cpass: any = '';
  public mail: any = '';
  public rememberMe;
  public userid;
  public user;
  public valid = true;
  public pusher;
  constructor(public platform: Platform,
    public loadingcontroller: LoadingController,
    public statusBar: StatusBar,
    public network: Network,
    public friendServ:FriendProvider,
    public splashScreen: SplashScreen,
    public msgServ: MessageProvider,
    public auth: AuthenticationProvider,
    public alertCtrl: AlertController,
    public toastController: ToastController) {
    platform.ready().then(() => {
      statusBar.backgroundColorByName('black');
      splashScreen.hide();
    });
    this.pusher = new Pusher('74df637180c0aa9440a4', { cluster: 'ap2', forceTLS: true });
    const confirmation_channel = this.pusher.subscribe('confirmation');
    confirmation_channel.bind('confirm-code', (data) => {
      if (data) {
        this.registrationCode = data;
      }
    });
  }
  ngOnInit() {
    // this.presentLoadingWithOptions();
    this.connectionCheck();
    this.disp = Boolean(localStorage.getItem('state'));
    this.displogin = Boolean(localStorage.getItem('state'));
  }
  login(username, password) {
    this.subscriptionList.push(this.auth.login(username, password, this.rememberMe).pipe(first()).subscribe(
      data => {
        if (!data) {
          this.toaster("Please check your Credintials!");
        }
        else {
          this.user = data;
          for (const u of this.user) {
            this.userid = u._id;
          }
          // let body = {
          //   "id": this.userid,
          //   "status": "1"
          // }
          // this.auth.setstatus(body).subscribe(data => { });
          if (localStorage.getItem('state')) {
            if (!this.dispreg) {
              this.dispreg = !Boolean(localStorage.getItem('state'));
            }
            this.disp = Boolean(localStorage.getItem('state'));
            this.displogin = Boolean(localStorage.getItem('state'));
          }
          else {
            if (!this.dispreg) {
              this.dispreg = !Boolean(localStorage.getItem('state'));
            }
            this.disp = Boolean(sessionStorage.getItem('state'));
            this.displogin = Boolean(sessionStorage.getItem('state'));
          }

        }
      },
      error => {
        console.log(error);
      }));
  }
  async toaster(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  bannerImageOpen() {
    this.bannerImageHt = 260;
    this.scaleDeg = 1;
    this.mgTop = 5;
  }
  bannerImageClose() {
    this.bannerImageHt = 0;
    this.scaleDeg = 0;
    this.mgTop = 20;
  }
  async presentLoadingWithOptions(duration) {
    const loading = await this.loadingcontroller.create({
      spinner: 'hide',
      duration: duration,
      content: `<img src="../assets/loader.gif" />`,
      cssClass: 'custom-class custom-loading'
    });
    return await loading.present();
  }
  checkuser() {
    let body = {
      "username": this.uname,
      "email": this.mail,
      "confirm_code": Math.floor(100000 + Math.random() * 900000)
    }
    this.checkusername(body);
    this.checkemail(body);
    this.presentLoadingWithOptions(4000);
    setTimeout(() => {
      if (this.validUsername && this.validEmail) {
        this.subscriptionList.push(this.auth.confirmationMail(body).subscribe());
        const prompt = this.alertCtrl.create({
          message: 'Enter a Confirmation code sent to <b>' + this.mail + '</b>',
          enableBackdropDismiss: false,
          inputs: [
            {
              name: 'code',
              min: 6,
              type: 'number',
              placeholder: 'XXXXXX'
            }
          ],
          buttons: [
            {
              text: 'OK',
              handler: data => {
                this.confirmationCode(data.code);
              },
            },
            {
              text: 'Cancel',
              handler: data => {
                this.alertCtrl;
              },
            }
          ]
        });
        prompt.present();
      }
      else {
        this.toaster("Username or Email id already used!!");
      }
    }, 4000);
  }
  checkusername(body) {
    this.subscriptionList.push(this.auth.checkusername(body).subscribe(data => {
      this.validUsername = Boolean(data);
    }));
  }
  checkemail(body) {
    this.subscriptionList.push(this.auth.checkemail(body).subscribe(data => { this.validEmail = Boolean(data) }));
  }
  confirmationCode(code) {
    if (this.registrationCode == code) {
      this.register();
    }
    else {
      this.toaster("Invalid Confirmation Code");
    }

  }
  register() {
    let body = {
      "username": this.uname,
      "firstname": this.fname,
      "lastname": this.lname,
      "password": this.pass,
      "mail": this.mail,
      "lastseen": new Date()
    }
    this.subscriptionList.push(this.auth.register(body).subscribe(data => {
      if (Boolean(data)) {
        this.toaster("User added successfully!!");
        this.subscriptionList.push(this.msgServ.setlastseen(body).subscribe());
        this.presentLoadingWithOptions(2000);
        setTimeout(() => {
          console.log(this.uname);
          this.login(this.uname, this.pass);
        }, 2000);
      }
      else {
        this.toaster("Username already used!!");
      }
    }));
  }
  logintoggle() {
    this.displogin = !this.displogin;
    this.dispreg = !this.dispreg;
  }
  connectionCheck() {
    // watch network for a disconnection
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      this.alertCtrl.create({
        enableBackdropDismiss: true,
        title: "<img src='../../assets/disconnect.png'/><br><i>Please Check Your Internet Connection!!</i>",
      }).present();
    });
    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
    });
  }
  ionViewCanLeave() {
  }
  ngOnDestroy() {
    for (const subscribedMethod of this.subscriptionList) {
      subscribedMethod.unsubscribe();
    }
  }
}