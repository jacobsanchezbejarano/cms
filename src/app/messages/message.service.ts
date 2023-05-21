import { EventEmitter, Injectable, Output } from '@angular/core';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  messages: Message[] = [];
  @Output() messageChangedEvent = new EventEmitter<Message[]>();
  constructor() {
      this.messages = MOCKMESSAGES;
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message | null{
    return this.messages.find(message => message.id === id) || null;
  }

  addMessage(message: Message){
    this.messages.push(message);
    this.messageChangedEvent.emit(this.getMessages());
  }
}
