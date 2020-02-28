import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';


/**
 * Generated class for the PagesCameratestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-cameratest',
  templateUrl: 'pages-cameratest.html',
})
export class PagesCameratestPage {
  public picture;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private cameraPreview: CameraPreview) {
  }

  openCamera(){
    const cameraPreviewOpts: CameraPreviewOptions = {
      x: 0,
      y: 0,
      width: 500,
      height: 500,
      camera: 'front',
      tapPhoto: true,
      previewDrag: true,
      toBack: true,
      alpha: 1
    }
    this.cameraPreview.startCamera(cameraPreviewOpts).then(
    (res) => {
      console.log(res);
    
    },
    (err) => {
      console.log(err)
    });  
    
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesCameratestPage');
  }

}
