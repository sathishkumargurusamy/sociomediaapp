import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import { MenuController, App } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { MyApp } from '../../app/app.component';
import { Camera } from '@ionic-native/camera';
import { User } from '../../models/user';
import { ISubscription } from "rxjs/Subscription";
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
// import * as jwt_decode from 'jwt-decode';
@Component({
  selector: 'page-pages-addpost',
  templateUrl: 'pages-addpost.html',
})
export class PagesAddpostPage {
  subscriptionList: ISubscription[] = [];
  public username: any;
  public userid: any;
  public mypost: any;
  public postImage;
  public picture;
  public imageOptionToggle = false;
  public user: User[];
  userLocation: any;
  userLocationPlace1: any;
  userLocationPlace2: any;
  userLocationPlace: any;
  constructor(private navCtrl: NavController,
    private app: App,
    private platform: Platform,
    public geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private auth: AuthenticationProvider,
    private menu: MenuController,
    private toastController: ToastController,
    public postserv: PostProvider,
    private camera: Camera,
  ) {
    // const jwt = JSON.parse(localStorage.getItem('currentUser'));
    // const jwtData = jwt_decode(jwt);
    // this.user = jwtData.user;
    if (localStorage.getItem('currentUser')) {
      this.user = JSON.parse(localStorage.getItem('currentUser'));
    }
    else {
      this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    }

  }
  getLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      if (this.platform.is('cordova')) {
        let options: NativeGeocoderOptions = {
          useLocale: true,
          maxResults: 5
        };
        this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude, options)
          .then((result) => {
            this.userLocation = result[0];
            this.userLocationPlace1 = this.userLocation.subLocality;
            this.userLocationPlace2 = this.userLocation.locality;
            this.userLocationPlace = this.userLocationPlace1 + ' ,' + this.userLocationPlace2;
          }
          )
          .catch((error: any) => console.log(error));
      }
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
  menutoggle() {
    this.menu.enable(false, 'home');
    this.menu.enable(false, 'myprofile');
    this.menu.enable(true, 'addpost');
    this.menu.toggle('addpost');
  }
  ngOnInit() {
    for (const i of this.user) {
      this.username = i.username;
      this.userid = i._id;
    }
    this.getLocation();
  }
  ionViewDidLoad() {
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Post Added Successfully',
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  addpost() {
    let body = {
      userid: this.userid,
      username: this.username,
      post: this.mypost || '',
      postimg: this.postImage || '',
      postedplace: this.userLocationPlace,
      likes: 0
    };
    this.subscriptionList.push(this.postserv.createpost(body).subscribe(data => {
      this.presentToast();
      this.mypost = '';
      this.postImage = '';
      this.navCtrl.pop();
    }));
  }
  opencamera() {
    this.camera.getPicture({
      targetWidth: 1200,
      targetHeight: 1800,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.postImage = 'data:image/jpeg;base64,' + imageData;
      this.picture = imageData;
      this.imageOptionToggle = !this.imageOptionToggle;

    }, (err) => {
      console.log(err);
    });
  }
  AccessGallery() {
    this.camera.getPicture({
      targetWidth: 1200,
      targetHeight: 1800,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.postImage = 'data:image/jpeg;base64,' + imageData;
      this.picture = imageData;
      this.imageOptionToggle = !this.imageOptionToggle;
    }, (err) => {
      console.log(err);
    });
  }
  removeimage() {
    this.postImage = '';
    this.imageOptionToggle = !this.imageOptionToggle;
  }
  ImageOptionToggle() {
    this.imageOptionToggle = !this.imageOptionToggle;
  }
  logout() {
    this.auth.logout();
    this.app.getRootNav().setRoot(MyApp);
  }
  ionViewDidLeave() {
    for (const subscribemethods of this.subscriptionList) {
      subscribemethods.unsubscribe();
    }
  }
}
