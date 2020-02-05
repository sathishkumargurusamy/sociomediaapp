import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { PostProvider } from '../../providers/post/post';
import { ToastController } from 'ionic-angular';
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
  public base64Image;
  public imgopt_toggle = false;
  public picture;
  public allusers;
  public userid;
  public interval;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public camera: Camera, public postservice: PostProvider, public toastController: ToastController) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
  }
  ngOnInit() {


    for (const u of this.user) {
      this.userid = u._id;
      this.firstname = u.firstname;
      this.lastname = u.lastname;
      this.username = u.username;
      this.base64Image = u.profileimage;
    }
    this.getuserdetails();

  }
  getuserdetails() {
    this.postservice.allusers().subscribe(data => {
      this.allusers = data;
      for (const all_users of this.allusers) {
        if (all_users._id == this.userid) {
          this.base64Image = all_users.profileimage;
        }
      }
    });

  }
  toggleedit() {
    this.isreadonly = !this.isreadonly;
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
  async toaster(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  updateprofile() {
    let body = {
      "_id": this.userid,
      "firstname": this.firstname,
      "lastname": this.lastname,
      "username": this.username,
      "profileimage": this.base64Image
    };
    this.postservice.updateprofile(body).subscribe(data => {
      this.toaster('Profile Updated Successfully!!');
    });
  }
  ionViewDidLoad() { 
    this.getuserdetails();
  }
}
