import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera } from '@ionic-native/camera/ngx';


@IonicPage()
@Component({
  selector: 'page-pages-editprofile',
  templateUrl: 'pages-editprofile.html',
})
export class PagesEditprofilePage {
  public isreadonly = true;
  public user;
  public firstname;
  public lastname;
  public username;
  constructor(public navCtrl: NavController, public navParams: NavParams, public camera: Camera) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }
  ngOnInit() {
    for (const u of this.user) {
      this.firstname = u.firstname;
      this.lastname = u.lastname;
      this.username = u.username;
    }

  }
  toggleedit() {
    this.isreadonly = !this.isreadonly;
  }
  AccessCamera() {

    this.camera.getPicture({

      targetWidth: 512,

      targetHeight: 512,

      correctOrientation: true,

      sourceType: this.camera.PictureSourceType.CAMERA,

      destinationType: this.camera.DestinationType.DATA_URL

    }).then((imageData) => {

      // this.base64Image = ‘data: image / jpeg; base64, ’+imageData;

      // this.picture = imageData;

    }, (err) => {

      console.log(err);

    });

  }

  AccessGallery() {

    this.camera.getPicture({

      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,

      destinationType: this.camera.DestinationType.DATA_URL

    }).then((imageData) => {

      // this.base64Image = ‘data: image / jpeg; base64, ’+imageData;

      // this.picture = imageData;

    }, (err) => {

      console.log(err);

    });

  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesEditprofilePage');
  }

}
