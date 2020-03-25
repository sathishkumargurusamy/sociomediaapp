import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';

@IonicPage()
@Component({
  selector: 'page-pages-cameratest',
  templateUrl: 'pages-cameratest.html',
})
export class PagesCameratestPage {
  public picture;
  picture64: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private cameraPreview: CameraPreview) {
  }

  openCamera() {
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: window.screen.width,
      height: window.screen.height,
      camera: 'back',
      tapPhoto: true,
      previewDrag: false,
      toBack: true,
      alpha: 1,
      tapToFocus: true
    }
    this.cameraPreview.startCamera(cameraPreviewOpts).then(
      (res) => {
        console.log(res);

      },
      (err) => {
        console.log(err)
      });
  }

  takePicture() {
    const pictureOpts: CameraPreviewPictureOptions = {
      width: 1280,
      height: 1280,
      quality: 85
    }
    this.cameraPreview.takePicture(pictureOpts).then((imageData) => {
      this.picture = 'data:image/jpeg;base64,' + imageData;
      this.picture64 = imageData;
    }, (err) => {
      console.log(err);
      this.picture = 'assets/img/test.jpg';
    });
  }

  sendImage() {
    this.navCtrl.getPrevious().data.picture = this.picture;
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    this.openCamera();
    const elements = document.querySelectorAll(".tabbar");
    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'none';
      });
    }
  }

  turnCamera() {
    this.cameraPreview.switchCamera();
  }

  backToChat() {
    this.navCtrl.pop();
  }

  ngOnDestroy() {
    const elements = document.querySelectorAll(".tabbar");
    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'flex';
      });
    }
    this.cameraPreview.stopCamera();
  }

}
