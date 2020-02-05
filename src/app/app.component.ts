import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { TabsPage } from '../pages/tabs/tabs';
import { first } from 'rxjs/operators';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  public disp: boolean;
  public username: any;
  public password: any;
  public dispreg: boolean = true;
  public displogin: boolean;
  public fname: any;
  public lname: any;
  public uname: any;
  public pass: any;
  public cpass: any;
  public userid;
  public user;
  valid = true;
  constructor(platform: Platform, public loadingcontroller: LoadingController,
    statusBar: StatusBar, splashScreen: SplashScreen, public auth: AuthenticationProvider,
    public toastController: ToastController) 
  {
    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit() {
    this.presentLoadingWithOptions();
    this.disp = Boolean(localStorage.getItem('state'));
    this.displogin = Boolean(localStorage.getItem('state'));
  }

  login() {
    this.auth.login(this.username, this.password).pipe(first()).subscribe(
      data => {
        if (!data) {
          this.crederror();
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
      });
  }
  async crederror() {
    const toast = await this.toastController.create({
      message: 'Please check your Credintials!',
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  public
  async reg(msg) {
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

  register() {
    let body = {
      "username": this.uname,
      "firstname": this.fname,
      "lastname": this.lname,
      "password": this.pass,
    }
    this.auth.register(body).subscribe(data => {
      if (Boolean(data)) {
        console.log(data);
        this.reg("Username added successfully!!");
      }
      else {
        console.log(data);
        this.reg("Username already used!!");
      }
    });
  }
  logintoggle() {
    this.displogin = !this.displogin;
    this.dispreg = !this.dispreg;
  }
}
