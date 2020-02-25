import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from '../../models/post';
import { Comments } from '../../models/comments';
import { Likes } from '../../models/likes';
import { User } from '../../models/user';
import { Story } from '../../models/story';
@Injectable()
export class PostProvider {

  apiurl = 'https://sociomediaapp-server.herokuapp.com/api';
  constructor(public http: HttpClient) { }

  allusers() {
    return this.http.get<User[]>(this.apiurl + `/allusers`);
  }
  createpost(newpost) {
    return this.http.post(this.apiurl + `/post`, newpost);
  }
  updateprofile(body) {
    return this.http.put(this.apiurl + `/updateuser/` + body._id, body);
  }
  getuser(id) {
    return this.http.get<User[]>(this.apiurl + `/user/` + id);
  }
  getpost() {
    return this.http.get<Post>(this.apiurl + `/post`);
  }
  getthispost(pid) {
    return this.http.get<Post[]>(this.apiurl + `/posts/` + pid);
  }
  updatepost(body) {
    return this.http.put(this.apiurl + `/post/` + body._id, body);
  }
  getmypost(userid) {
    return this.http.get<Post>(this.apiurl + `/mypost/` + userid);
  }
  deletepost(id) {
    return this.http.delete(this.apiurl + `/post/` + id).pipe(map(res => {
      this.deletepostcomment(id);
    }));
  }
  deletepostcomment(id) {
    return this.http.delete(this.apiurl + `/comment/` + id);
  }
  deletepostlike(id) {
    return this.http.delete(this.apiurl + `/like/` + id);
  }

  addcomment(userid, postid, username, comment) {
    return this.http.post(this.apiurl + `/comments`, { userid, postid, username, comment });

  }
  getgrpdetail(id) {
    return this.http.get(this.apiurl + `/groups/` + id);
  }
  getgroups() {
    return this.http.get(this.apiurl + `/groups`);
  }
  getallusers() {
    return this.http.get<User[]>(this.apiurl + `/allusers`);
  }
  creategroup(body) {
    return this.http.post(this.apiurl + `/groups`, body);
  }

  getcomment() {
    return this.http.get<Comments>(this.apiurl + `/comments`);
  }
  deletecomment(id) {
    return this.http.delete(this.apiurl + `/comments/` + id);
  }

  getlikes(uid) {
    return this.http.get<Likes[]>(this.apiurl + `/likes/` + uid);
  }
  postlikes(body) {
    return this.http.post(this.apiurl + `/likes`, body);
  }
  deletelikes(body) {
    return this.http.delete(this.apiurl + `/likes/` + body.userid + `&` + body._id);
  }
  addStory(body) {
    return this.http.post(this.apiurl + `/story`, body);
  }
  getAllStory() {
    return this.http.get<Story[]>(this.apiurl + `/story`);
  }
  getStory(id) {
    return this.http.get<Story>(this.apiurl + `/story/` + id);
  }
}
