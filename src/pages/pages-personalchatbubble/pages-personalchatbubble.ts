import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { ChatProvider } from '../../providers/chat/chat';
import{PostProvider} from '../../providers/post/post';


/**
 * Generated class for the PagesPersonalchatbubblePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-personalchatbubble',
  templateUrl: 'pages-personalchatbubble.html',
})
export class PagesPersonalchatbubblePage {

  username;
  userid;
  user;

  interval;
 
  messageText:String='';
  messageArray:Array<{user:String,message:String}> = [];
 defaultmessage:Array<{user:String,message:String}> = [];
 defaultmessage1:Array<{user:String,message:String}> = [];
 
  constructor(public navCtrl: NavController,public postserv:PostProvider, public navParams: NavParams,private socket: Socket,public _chatService:ChatProvider) {
    this.user=JSON.parse(localStorage.getItem('currentUser'));
    this._chatService.newUserJoined()
      .subscribe(data=> {this.defaultmessage=[];
        this.defaultmessage1=[];
        this.defaultmessage.push(data);});


      this._chatService.userLeftRoom()
      .subscribe(data=> {this.defaultmessage1=[];
        this.defaultmessage=[];
        this.defaultmessage1.push(data);});

      this._chatService.newMessageReceived()
      .subscribe(data=>{this.messageArray.push(data);
      });
  }
  ionViewDidLeave() {
    this.leave();
  }
  ngOnInit(){
    for(const i of this.user){
      this.username=i.username;
      this.userid=i._id;
    }
    this.join();
  }
 join(){
   this._chatService.joinRoom({user:this.username,room:this.navParams.get('room')});
  
 }
 

  leave(){
      this._chatService.leaveRoom({user:this.username, room: this.navParams.get('room')});
  }

  sendMessage()
  {
      this._chatService.sendMessage({user:this.username, room: this.navParams.get('room'), message:this.messageText});
  }


}
