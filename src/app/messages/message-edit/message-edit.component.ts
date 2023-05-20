import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subject!: ElementRef;
  @ViewChild('msgText') msgText!: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();
  currentSender = "Jacob Sanchez";

  constructor(){}
  onSendMessage(){
    const subjectValue = this.subject.nativeElement.value;
    const msgText = this.msgText.nativeElement.value;

    const message = new Message('1',subjectValue,msgText,this.currentSender);
    this.addMessageEvent.emit(message);

    this.onClear();
  }
  
  ngOnInit(): void {
    
  }

  onClear(){
    this.subject.nativeElement.value = '';
    this.msgText.nativeElement.value = '';
  }

  
}
