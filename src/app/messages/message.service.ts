import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
// import { MOCKMESSAGES } from './MOCKMESSAGES';
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
      .get<Message[]>('http://localhost:3000/messages')
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
    let maxId = 0;
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
    this.httpClient.put('http://localhost:3000/messages',
    data, { headers: headers }).subscribe(
      response => {
        let messagesListClone = this.messages.slice().sort((a, b) => a.id.localeCompare(b.id));
        this.messageListChangedEvent.next(messagesListClone);
      }
    )
  }

  sortAndSend() {
    this.httpClient
      .get<Message[]>('http://localhost:3000/messages')
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

  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message | null{
    return this.messages.find(message => message.id === id) || null;
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    // make sure id of the new Message is empty
    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.httpClient.post<{ res_message: string, message: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new message to messages
          this.messages.push(responseData.message);
          this.sortAndSend();
        }
      );
  }

}
