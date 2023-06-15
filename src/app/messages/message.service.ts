import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Message } from './message.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  maxMessageId!: number;

  messageListChangedEvent = new Subject<Message[]>();

  @Output() messageChangedEvent = new EventEmitter<Message[]>();
  constructor(private httpClient: HttpClient) {
      // this.messages = MOCKMESSAGES;
      this.maxMessageId = this.getMaxId();
      this.httpClient
      .get<Message[]>('https://cms-wdd430-jacob-default-rtdb.firebaseio.com/messages.json')
      .subscribe(
        // success method
        (messages: Message[] ) => {
            this.messages = messages;
            this.maxMessageId = this.getMaxId();
            const sortedMessages = messages.slice().sort((a, b) => a.id.localeCompare(b.id));
            this.messageListChangedEvent.next(sortedMessages);
        },
        // error method
        (error: any) => {
            console.error(error);
        } )
  }

  getMaxId() {
    let maxId = 0

      this.messages.forEach(message =>{
        let currentId = +message.id
          if (currentId > maxId){
            maxId = currentId;
          }
              
      })

      return maxId;
  }

  storeMessages() {
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
    let data = JSON.stringify(this.messages);
    this.httpClient.put('https://cms-wdd430-jacob-default-rtdb.firebaseio.com/messages.json',
    data, { headers: headers }).subscribe(
      response => {
        let messagesListClone = this.messages.slice().sort((a, b) => a.id.localeCompare(b.id));
        this.messageListChangedEvent.next(messagesListClone);
      }
    )
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message | null{
    return this.messages.find(message => message.id === id) || null;
  }

  addMessage(message: Message){
    if (message == undefined || null) {
      return
    }
    this.maxMessageId++
    message.id = ""+this.maxMessageId;
    this.messages.push(message);
    this.storeMessages();
  }
}
