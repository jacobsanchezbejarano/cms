import { Component, OnDestroy, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, OnDestroy {
  
  messages: Message[] = [];
  private subscription!: Subscription;

  constructor (private messageService: MessageService) {  }

  onAddMessage(message: Message){
    this.messages.push(message);
  }

  ngOnInit() {
    this.messages = this.messageService.getMessages();

    this.subscription = this.messageService.messageListChangedEvent 
      .subscribe(
        (messagesList: Message[]) => {
          this.messages = messagesList;
        }
      );
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
    
  }
}
