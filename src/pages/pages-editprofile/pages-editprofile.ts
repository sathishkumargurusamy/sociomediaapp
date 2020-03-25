import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { PostProvider } from '../../providers/post/post';
import { ToastController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { DatePipe } from '@angular/common';
import { User } from '../../models/user';
import { ISubscription } from "rxjs/Subscription";
import { IonicSwipeAllModule } from 'ionic-swipe-all';

@IonicPage()
@Component({
  selector: 'page-pages-editprofile',
  templateUrl: 'pages-editprofile.html',
})
export class PagesEditprofilePage {
  subscriptionList: ISubscription[] = [];
  public user: User[];
  public firstname;
  public readonly;
  public isreadonly = true;
  public lastname;
  public username;
  checked = "checked";
  public gender = '';
  public base64Image;
  public imgopt_toggle = false;
  public picture;
  public allusers: User[];
  public pusher;
  public userid;
  selectedIndex: number;
  date_of_birth: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private datePicker: DatePicker,
    public camera: Camera,
    public postservice: PostProvider,
    public toastController: ToastController,
    public swipe: IonicSwipeAllModule,
    private datePipe: DatePipe
  ) {
    if(localStorage.getItem('currentUser')){
      this.user = JSON.parse(localStorage.getItem('currentUser'));
    }
    else{
      this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    }
    this.readonly = -1;
  }
  ngOnInit() {
    for (const u of this.user) {
      this.userid = u._id;
    }
    this.getuserdetails();

  }
  getuserdetails() {
    this.subscriptionList.push(this.postservice.allusers().subscribe(data => {
      this.allusers = data;
      for (const all_users of this.allusers) {
        if (all_users._id == this.userid) {
          this.userid = all_users._id;
          this.firstname = all_users.firstname;
          this.lastname = all_users.lastname;
          this.username = all_users.username;
          this.base64Image = all_users.profileimage;
          this.date_of_birth = all_users.dob;
          this.gender = all_users.gender;
        }
      }
    },
      error => {
        if (error) {
          console.log('Error getting user details', error);
        }
      }));

  }
  toggleedit(index) {
    if (this.readonly == index) {
      this.readonly = -1;
    }
    else {
      this.readonly = index;
    }
  }
  opencamera() {
    this.camera.getPicture({
      targetWidth: 1200,
      targetHeight: 1800,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL
    }).then((imageData) => {
      this.picture = imageData;
      this.imgopt_toggle = !this.imgopt_toggle;
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
      "profileimage": this.base64Image,
      "dateofbirth": this.date_of_birth,
      "gender": this.gender
    };
    this.subscriptionList.push(this.postservice.updateprofile(body).subscribe(data => {
      this.toaster('Profile Updated Successfully!!');
      this.navCtrl.pop();
    }));
  }
  removephoto() {
    this.imgopt_toggle = !this.imgopt_toggle;
    this.base64Image = '';
  }
  ionViewDidLoad() {
    this.getuserdetails();
  }
  showDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_LIGHT
    }).then(
      date => this.date_of_birth = this.datePipe.transform(date, "dd-MMM-yyyy"),
      err => console.log('Error occurred while getting date: ', err)
    );
  }
  selectGender(value) {
    this.gender = value;
  }
  ionViewDidLeave() {
    for (const subscribedMethods of this.subscriptionList) {
      subscribedMethods.unsubscribe();
    }
  }
}