import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import{AuthenticationProvider} from '../providers/authentication/authentication';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';



import { TabsPage } from '../pages/tabs/tabs';
import { first } from 'rxjs/operators';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
disp:boolean;
username:any;
password:any;
userid;
user;
  constructor(platform: Platform,public loadingcontroller:LoadingController, statusBar: StatusBar, splashScreen: SplashScreen,public auth:AuthenticationProvider,public toastController: ToastController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  ngOnInit(){
    this.presentLoadingWithOptions();
    this.disp=Boolean(localStorage.getItem('state'));
    
  }
  login(){
    this.auth.login(this.username, this.password)
        .pipe(first())
        .subscribe(
            data => {
              if(data=='Username or Password Incorrect..!!')
              { 
              console.log(Boolean(localStorage.getItem('state')));
              this.crederror();}
              else{
                this.user=data;
                for(let u of this.user){
this.userid=u._id;
                }
                let body={
                  "id":this.userid,
                  "status":"1"
                }
                this.auth.setstatus(body).subscribe(data=>{});
                this.disp=Boolean(localStorage.getItem('state'));
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
      position:'top'
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
}
