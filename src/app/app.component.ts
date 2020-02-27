import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { TabsPage } from '../pages/tabs/tabs';
import { first } from 'rxjs/operators';
import { ISubscription } from "rxjs/Subscription";
import { AlertController } from 'ionic-angular';
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
  public validUsername:boolean;
  public validEmail:boolean;
  public password: any;
  public dispreg: boolean = true;
  public displogin: boolean;
  public fname: any;
  public lname: any;
  public uname: any;
  public pass: any;
  public cpass: any;
  public mail: any;
  public userid;
  public user;
  public valid = true;
  public pusher;
  constructor(public platform: Platform,
    public loadingcontroller: LoadingController,
    public statusBar: StatusBar, public splashScreen: SplashScreen,
    public auth: AuthenticationProvider, public alertCtrl: AlertController,
    public toastController: ToastController) {
    platform.ready().then(() => {
      statusBar.backgroundColorByName('black');
      splashScreen.hide();
      platform.setLang('ta', true);
    });
    this.pusher = new Pusher('74df637180c0aa9440a4', { cluster: 'ap2', forceTLS: true });
    const confirmation_channel = this.pusher.subscribe('confirmation');
    confirmation_channel.bind('confirm-code', (data) => {
      if (data) {
        this.registrationCode=data;
      }
    });
  }
  ngOnInit() {
    this.presentLoadingWithOptions();
    this.disp = Boolean(localStorage.getItem('state'));
    this.displogin = Boolean(localStorage.getItem('state'));
  }
  login(username,password) {
    username=this.username;
    password=this.password;
    this.subscriptionList.push(this.auth.login(username, password).pipe(first()).subscribe(
      data => {
        if (!data) {
          this.toaster("Please check your Credintials!");
        }
        else {
          this.user = data;
          for (const u of this.user) {
            this.userid = u._id;
          }
          let body = {
            "id": this.userid,
            "status": "1"
          }
          this.auth.setstatus(body).subscribe(data => { });
          this.disp = Boolean(localStorage.getItem('state'));
          this.displogin = Boolean(localStorage.getItem('state'));
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

  async presentLoadingWithOptions() {
    const loading = await this.loadingcontroller.create({
      spinner: 'hide',
      duration: 1000,
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
    
    setTimeout(() => {
      console.log(this.validUsername,this.validEmail);
      if (this.validUsername && this.validEmail) {
        this.subscriptionList.push(this.auth.confirmationMail(body).subscribe(data=>console.log(data)));
        const prompt = this.alertCtrl.create({
          message: 'Enter a Confirmation code sent to <b>' + this.mail + '</b>',
          inputs: [
            {
              name: 'code',
              max:6,
              type: 'number',
              placeholder: 'XXXXXX'
            }
          ],
          buttons: [
            {
              text: 'OK',
              handler: data => {
                this.confirmationCode(data.code);
              }
            }
          ]
        });
        prompt.present();
      }
      else {
        this.toaster("Username or Email id already used!!");
      }
    }, 3000);
  }
  checkusername(body){
    this.subscriptionList.push(this.auth.checkusername(body).subscribe(data => {
      this.validUsername=Boolean(data);
    }));
  }
  checkemail(body){
    this.subscriptionList.push(this.auth.checkemail(body).subscribe(data => {this.validEmail=Boolean(data)}));
  }
  confirmationCode(code) {
    if(this.registrationCode==code){
      this.register();
    }
    else{
      this.toaster("Invalid Confirmation Code");
    }

  }
  register() {
    let body = {
      "username": this.uname,
      "firstname": this.fname,
      "lastname": this.lname,
      "password": this.pass,
      "mail": this.mail
    }
    this.subscriptionList.push(this.auth.register(body).subscribe(data => {
      if (Boolean(data)) {
        this.toaster("User added successfully!!");
        this.login(this.uname,this.pass);
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
  ngOnDestroy() {
    for (const subscribedMethod of this.subscriptionList) {
      subscribedMethod.unsubscribe();
    }
  }
}