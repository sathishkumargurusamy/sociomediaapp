import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable()
export class MessageProvider {
  apiurl = 'https://sociomediaapp-server.herokuapp.com/api';
  constructor(public http: HttpClient) {
  }
  sendmessasge(body){
    return this.http.post(this.apiurl+`/message`,body);
  }
  getallmessage(){
    return this.http.get(this.apiurl+`/message`);
  }
}
