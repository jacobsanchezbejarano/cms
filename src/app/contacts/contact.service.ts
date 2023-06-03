import { EventEmitter, Injectable, Output } from '@angular/core';
import { Contact } from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  @Output() contactSelectedEvent = new EventEmitter<Contact>();
  @Output() contactChangedEvent = new EventEmitter<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();

  contacts: Contact[] = [];
  maxContactId!: number;

  constructor() { 
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact | null {
    return this.contacts.find(contact => contact.id === id) || null;
  }

  deleteContact(contact: Contact | null) { 
    if (contact == undefined || null) {
      return;
   }
   const pos = this.contacts.indexOf(contact);
   if (pos < 0) {
      return;
   }
   this.contacts.splice(pos, 1);
   let contactsListClone = this.contacts.slice();
   this.contactListChangedEvent.next(contactsListClone);
  }

  getMaxId(){
    let maxId = 0

      this.contacts.forEach(contact =>{
        let currentId = +contact.id
          if (currentId > maxId){
            maxId = currentId;
          }
              
      })

      return maxId;
  }

  addDocument(newContact: Contact) {
    if (newContact == undefined || null) {
      return
    }

    this.maxContactId++
    newContact.id = ""+this.maxContactId;
    this.contacts.push(newContact);
    let contactsListClone = this.contacts.slice();
    this.contactListChangedEvent.next(contactsListClone);
  }

  updateDocument(originalContact: Contact, newContact: Contact) {
      if ((originalContact == undefined || null) || (newContact == undefined || null)){
          return;
      }
      
      let pos = this.contacts.indexOf(originalContact)
      if (pos < 0){
        return;
      }

      newContact.id = originalContact.id;
      this.contacts[pos] = newContact;
      let contactsListClone = this.contacts.slice()
      this.contactListChangedEvent.next(contactsListClone)
  }
}
