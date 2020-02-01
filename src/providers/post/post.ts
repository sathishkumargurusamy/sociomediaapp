import { Injectable } from '@angular/core';
import{HttpClient}from '@angular/common/http';
import{map} from 'rxjs/operators';


@Injectable()
export class PostProvider {

  apiurl='https://sociomediaapp-server.herokuapp.com/api';
  constructor(public http:HttpClient) { }


  createpost(newpost){
    return this.http.post(this.apiurl+`/post`,newpost);
  
  }
  getuser(id){
    return this.http.get(this.apiurl+`/user/`+id);
  }
  getpost(){
    return this.http.get(this.apiurl+`/post`);
  }
  getthispost(pid){
    return this.http.get(this.apiurl+`/posts/`+pid);
  }
  updatepost(body){
    return this.http.put(this.apiurl+`/post/`+body._id,body);
  }
  getmypost(userid){
    return this.http.get(this.apiurl+`/mypost/`+userid);
  }
  deletepost(id){
     return this.http.delete(this.apiurl+`/post/`+id).pipe(map(res=>{
      this.deletepostcomment(id);
     }));
  }
  deletepostcomment(id){
   return this.http.delete(this.apiurl+`/comment/`+id);
  }

  addcomment(userid,postid,username,comment){
    return this.http.post(this.apiurl+`/comments`,{userid,postid,username,comment});

  }
  getgrpdetail(id){
    return this.http.get(this.apiurl+`/groups/`+id);
  }
  getgroups(){
    return this.http.get(this.apiurl+`/groups`);
  }
  getallusers(){
    return this.http.get(this.apiurl+`/allusers`);
  }
  creategroup(body){
    return this.http.post(this.apiurl+`/groups`,body);
  }

  getcomment(){
    return this.http.get(this.apiurl+`/comments`);
  }
  deletecomment(id){
    return this.http.delete(this.apiurl+`/comments/`+id);
  }

  getlikes(uid){
    return this.http.get(this.apiurl+`/likes/`+uid);
  }
  postlikes(body){
    return this.http.post(this.apiurl+`/likes`,body);
  }
  deletelikes(id){

 return this.http.delete(this.apiurl+`/likes/`+id);
  }

}
