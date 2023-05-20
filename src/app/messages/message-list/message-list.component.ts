import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message ('1','Test 1','Test message','Jacob'),
    new Message ('1','Test 2','Test message 2','Jacob'),
    new Message ('1','Test 3','Test message 3','Nola'),
  ];

  onAddMessage(message: Message){
    this.messages.push(message);
  }

  ngOnInit(): void {
    
  }
}
