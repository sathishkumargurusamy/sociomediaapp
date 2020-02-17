import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import { MenuController, App } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { MyApp } from '../../app/app.component';
import { Camera } from '@ionic-native/camera';
import { User } from '../../models/user';
import { ISubscription } from "rxjs/Subscription";
// import * as jwt_decode from 'jwt-decode';

@IonicPage()
@Component({
  selector: 'page-pages-addpost',
  templateUrl: 'pages-addpost.html',
})
export class PagesAddpostPage {
  subscriptionList: ISubscription[];
  public username: any;
  public userid: any;
  public mypost: any;
  public postImage;
  public picture;
  public imageOptionToggle = false;
  public user: User[];
  constructor(private navCtrl: NavController, private app: App, private auth: AuthenticationProvider,
    private menu: MenuController, private toastController: ToastController,
    public postserv: PostProvider, private camera: Camera,
  ) {
    // const jwt = JSON.parse(localStorage.getItem('currentUser'));
    // const jwtData = jwt_decode(jwt);
    // this.user = jwtData.user;
    this.user = JSON.parse(localStorage.getItem('currentUser'));
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
  ngOnDesstroy(){
    
  }
}
