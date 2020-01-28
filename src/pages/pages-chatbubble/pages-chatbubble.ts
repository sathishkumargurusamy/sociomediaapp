import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { ChatProvider } from '../../providers/chat/chat';
import{PostProvider} from '../../providers/post/post';


/**
 * Generated class for the PagesChatbubblePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-chatbubble',
  templateUrl: 'pages-chatbubble.html',
})
export class PagesChatbubblePage {
  username;
  userid;
  user;
  groupdetail;
  interval;
 
  messageText:String='';
  messageArray:Array<{user:String,message:String}> = [];
  constructor(public navCtrl: NavController,public postserv:PostProvider, public navParams: NavParams,private socket: Socket,public _chatService:ChatProvider) {
    this.user=JSON.parse(localStorage.getItem('currentUser'));
    this._chatService.newUserJoined()
      .subscribe(data=> this.messageArray.push(data));


      this._chatService.userLeftRoom()
      .subscribe(data=>this.messageArray.push(data));

      this._chatService.newMessageReceived()
      .subscribe(data=>{this.messageArray.push(data);
      });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesChatPage');
  }
  ngOnInit(){
    for(const i of this.user){
      this.username=i.username;
      this.userid=i._id;
    }
    this.getgrpdetail();
    this.join();
  }
 join(){
   this._chatService.joinRoom({user:this.username,room:this.navParams.get('room')});
 }
 
getgrpdetail(){
  this.postserv.getgrpdetail(this.navParams.get('groupid')).subscribe(data=>this.groupdetail=data);
}
  leave(){
      this._chatService.leaveRoom({user:this.username, room: this.navParams.get('room')});
  }

  sendMessage()
  {
      this._chatService.sendMessage({user:this.username, room: this.navParams.get('room'), message:this.messageText});
  }

}
