import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class FriendProvider {

  constructor(public http: HttpClient) {}
  apiurl = 'https://sociomediaapp-server.herokuapp.com/api';

addFriend(body){
  return this.http.post(this.apiurl + `/friendlist`, body);
}

getFriendList(body){
  return this.http.get(this.apiurl + `/friendlist/`+body.friend1+`&&`+body.friend2);
}

updateFriend(body){
  return this.http.put(this.apiurl + `/friendlist`, body);
}

getAllFriendList(body){
  return this.http.get(this.apiurl + `/allfriendlist/`+body.friend1);
}
deleteFriendRequest(body){
  return this.http.delete(this.apiurl + `/friendlist/` + body.friend1 + `&` + body.friend2);
}

}
