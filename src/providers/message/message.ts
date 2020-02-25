import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../../models/message';
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
}
