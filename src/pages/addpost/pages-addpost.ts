import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { PostProvider } from '../../providers/post/post';
import { MenuController, App } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { MyApp } from '../../app/app.component';
import { Camera } from '@ionic-native/camera';
import * as jwt_decode from 'jwt-decode';

@IonicPage()
@Component({
  selector: 'page-pages-addpost',
  templateUrl: 'pages-addpost.html',
})
export class PagesAddpostPage {
  username: any;
  userid: any;
  mypost: any;
  public base64Image;
  public picture;
  public imgopt_toggle = false;
  user;
  constructor(public navCtrl: NavController, public app: App,
    public auth: AuthenticationProvider,
    private menu: MenuController, public navParams: NavParams,
    public toastController: ToastController, public postserv: PostProvider,
    public camera: Camera) {
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
      post: this.mypost,
      likes: 0
    };
    this.mypost = '';
    this.postserv.createpost(body).subscribe(data => {
      this.presentToast();
    });
  }
  opencamera() {
    this.camera.getPicture({

      targetWidth: 512,

      targetHeight: 512,

      correctOrientation: true,

      sourceType: this.camera.PictureSourceType.CAMERA,

      destinationType: this.camera.DestinationType.DATA_URL

    }).then((imageData) => {

      this.base64Image = 'data:image/jpeg;base64,' + imageData;

      this.picture = imageData;
      this.imgopt_toggle = !this.imgopt_toggle;

    }, (err) => {

      console.log(err);

    });
  }
  AccessGallery() {

    this.camera.getPicture({

      targetWidth: 512,

      targetHeight: 512,

      correctOrientation: true,

      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,

      destinationType: this.camera.DestinationType.DATA_URL

    }).then((imageData) => {

      this.base64Image = 'data:image/jpeg;base64,' + imageData;

      this.picture = imageData;
      this.imgopt_toggle = !this.imgopt_toggle;

    }, (err) => {

      console.log(err);

    });
  }
  imgopttoggle() {
    this.imgopt_toggle = !this.imgopt_toggle;
  }
  logout() {
    this.auth.logout();
    this.app.getRootNav().setRoot(MyApp);
  }
}
