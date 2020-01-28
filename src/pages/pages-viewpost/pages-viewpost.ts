import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import{PostProvider} from '../../providers/post/post';
import{AuthenticationProvider} from '../../providers/authentication/authentication';


/**
 * Generated class for the PagesViewpostPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pages-viewpost',
  templateUrl: 'pages-viewpost.html',
})
export class PagesViewpostPage {
  post:any;
  comments:any=[];

 
  dispcomment:any='';
  comment;
  errcomment:any='';
  user;
  likecount:any=[];
  username:any='';
 
  likes:any='';
  userid:any='';
  liketoggle=[];
  thispost:any='';
  showcommenttoggle1:any=[];
  loggeduser;
loggeduserid;

  constructor(public navCtrl: NavController, public navParams: NavParams,public auth:AuthenticationProvider,public postserv:PostProvider) {
  }
  ngOnInit(){
    this.loggeduser=JSON.parse(localStorage.getItem('currentUser'));
    for(const i of this.loggeduser){
      this.loggeduserid=i._id;
    }
    
    this.userid=this.navParams.get('id');
    this.getprofile(this.userid);
this.getcomment();
this.getuser(this.userid);
  }
  getuser(id){
    this.postserv.getuser(id).subscribe(data=>{
      this.user=data;
      for(const i of this.user){
        this.username=i.username;
        
      }
    });
    
    }
    
    
      getprofile(userid){
        this.postserv.getmypost(userid).subscribe(data=>{
          this.post=data;
        })
    
      }
      getcomment(){
        this.postserv.getcomment().subscribe(data=>{
          if(data){
            this.dispcomment=data;
          }
        
        });
    
      }
      addcomment(id,userid,j,username){
        console.log(id,userid,this.comments[j],username);
      
        this.postserv.addcomment(userid,id,username,this.comments[j]).subscribe(data=>{
          console.log('Added Successfully');
          this.getcomment();
        });
      }
    
      // gotoprofile(id){
      //   this.route.navigateByUrl('/viewprofile/'+id);
        
      // }
      deletepost(id){
        this.postserv.deletepost(id).subscribe(data=>{
          this.getprofile(this.userid);
        });
    
      }
      
      deletecomment(id){
        this.postserv.deletecomment(id).subscribe(data=>{
          this.getcomment();
        });
    
      }
      showcommenttoggle(j){
        this.showcommenttoggle1[j]=!this.showcommenttoggle1[j];
       
      }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PagesViewpostPage');
  }

}
