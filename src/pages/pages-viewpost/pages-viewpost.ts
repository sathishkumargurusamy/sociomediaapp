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
  allikes;
  likes:any='';
  userid:any='';
  liketoggle=[];
  thispost:any='';
  interval;
  showcommenttoggle1:any=[];
  loggeduser;
loggeduserid;
loggedusername;

  constructor(public navCtrl: NavController, public navParams: NavParams,public auth:AuthenticationProvider,public postserv:PostProvider) {
  }
  ngOnInit(){
    this.loggeduser=JSON.parse(localStorage.getItem('currentUser'));
    for(const i of this.loggeduser){
      this.loggeduserid=i._id;
      this.loggedusername=i.username;
    }
    this.userid=this.navParams.get('id');
    this.getprofile(this.userid);
    this.getuser(this.userid);
    this.interval = setInterval(() => {
    
this.getcomment();
this.alllikes(this.loggeduserid);

    },8000);
  }
  ionViewWillEnter() {
    this.userid=this.navParams.get('id');
    this.getprofile(this.userid);
    this.getuser(this.userid);
    
     
  this.getcomment();
  this.alllikes(this.loggeduserid);
  
     
    }

  getuser(id){
    this.postserv.getuser(id).subscribe(data=>{
      this.user=data;
      for(const i of this.user){
        this.username=i.username;
        
      }
    });
    
    }
    
    addlikes(j,uid,pid){
      console.log('Hii');
      this.postserv.getthispost(pid).subscribe(data=>{
        this.thispost=data;
      for(let p of this.thispost){
        this.likecount[pid]=p.likes;
      } 
      
    
          this.liketoggle[pid]=!this.liketoggle[pid];
          
          if(this.liketoggle[pid]){
            console.log(this.likecount[pid]+1);
            this.likecount[pid]=this.likecount[pid]+1;
            let body={
              _id:pid,
        
              likes:this.likecount[pid]
            };
            this.postserv.updatepost(body).subscribe(data=>{this.getprofile(this.userid);});
            let body1={
              userid:this.loggeduserid,
              username:this.loggedusername,
              postid:pid,
              status:true
            };
         
            this.postserv.postlikes(body1).subscribe(data1=>{console.log(data1);});
            
          } 
          else{
            if(this.likecount[pid]>0){
              console.log(this.likecount[pid]-1);
              this.likecount[pid]=this.likecount[pid]-1;
              let body={
                _id:pid,
                userid:this.post.userid,
                username:this.post.username,
                post:this.post.post,
                likes:this.likecount[pid]
              };
              this.postserv.updatepost(body).subscribe(data=>{this.getprofile(this.userid);});
              this.postserv.deletelikes(this.userid).subscribe(data1=>{console.log(data1);});
              
            }
            
          }
          
    
      });
      
    }
    alllikes(uid){
      this.postserv.getlikes(uid).subscribe(data=>{this.allikes=data;
        for(let l of this.allikes){
         
          this.liketoggle[l.postid]=l.status;
         
         }});
     
    
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
