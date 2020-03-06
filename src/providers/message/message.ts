import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../../models/message';
import { LastseenData } from '../../models/lastseen';
@Injectable()
export class MessageProvider {
  apiurl = 'https://sociomediaapp-server.herokuapp.com/api';
  constructor(public http: HttpClient) {
  }
  sendmessasge(body) {
    return this.http.post(this.apiurl + `/message`, body);
  }
  getallmessage() {
    return this.http.get<Message[]>(this.apiurl + `/message`);
  }
  setreadstatus(body) {
    return this.http.put(this.apiurl + `/message/` + body._id, body);
  }
  getlastseen(username){
    return this.http.get<LastseenData[]>(this.apiurl+`/lastseen/`+username);
  }
  getalllastseendata(){
    return this.http.get<LastseenData[]>(this.apiurl+`/lastseens`);
  }
  setlastseen(body){
    return this.http.post(this.apiurl + `/lastseen`, body);
  }
  putlastseen(body){
    return this.http.put(this.apiurl + `/lastseen`, body);
}
}
