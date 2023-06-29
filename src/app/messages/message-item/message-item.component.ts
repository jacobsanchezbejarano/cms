import { Component, Injectable, Input, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { ContactService } from 'src/app/contacts/contact.service';
import { Contact } from 'src/app/contacts/contact.model';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit{
   @Input() message!: Message;
   messageSender!: string | null;
   constructor(private contactService: ContactService) {}
   ngOnInit() {
      const contact: Contact | null = this.contactService.getContact(this.message.sender);
      if(contact != null){
        this.messageSender = contact.name;
      }
   }
}
