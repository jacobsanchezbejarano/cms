import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  constructor(private httpClient: HttpClient) { 

    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
    this.httpClient
    .get<Contact[]>('https://cms-wdd430-jacob-default-rtdb.firebaseio.com/contacts.json')
    .subscribe(
       // success method
       (contacts: Contact[] ) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          const sortedDocuments = contacts.slice().sort((a, b) => a.name.localeCompare(b.name));
          this.contactListChangedEvent.next(sortedDocuments);
       },
       // error method
       (error: any) => {
          console.error(error);
       } )
  }

  storeContacts() {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
      let data = JSON.stringify(this.contacts);
      this.httpClient.put('https://cms-wdd430-jacob-default-rtdb.firebaseio.com/contacts.json',
      data, { headers: headers }).subscribe(
        response => {
          let contactsListClone = this.contacts.slice().sort((a, b) => a.name.localeCompare(b.name));
          this.contactListChangedEvent.next(contactsListClone);
        }
      )
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
   this.storeContacts();
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
    this.storeContacts();
  }

  updateDocument(originalContact: Contact | null, newContact: Contact) {
      if ((originalContact == undefined || null) || (newContact == undefined || null)){
          return;
      }
      
      let pos = this.contacts.indexOf(originalContact)
      if (pos < 0){
        return;
      }

      newContact.id = originalContact.id;
      this.contacts[pos] = newContact;
      this.storeContacts();
  }
}
