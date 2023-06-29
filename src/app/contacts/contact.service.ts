import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Contact } from './contact.model';
// import {MOCKCONTACTS} from './MOCKCONTACTS';
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

    // this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
    this.httpClient
    .get<Contact[]>('http://localhost:3000/contacts')
    .subscribe(
       // success method
       (contacts: Contact[] ) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          const sortedContacts = contacts.slice().sort((a, b) => a.name.localeCompare(b.name));
          this.contactListChangedEvent.next(sortedContacts);
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
      this.httpClient.put('http://localhost:3000/contacts',
      data, { headers: headers }).subscribe(
        response => {
          let contactsListClone = this.contacts.slice().sort((a, b) => a.name.localeCompare(b.name));
          this.contactListChangedEvent.next(contactsListClone);
        }
      )
  }

  sortAndSend(){
    this.httpClient
    .get<Contact[]>('http://localhost:3000/contacts')
    .subscribe(
       // success method
       (contacts: Contact[] ) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          const sortedContacts = contacts.slice().sort((a, b) => a.name.localeCompare(b.name));
          this.contactListChangedEvent.next(sortedContacts);
       },
       // error method
       (error: any) => {
          console.error(error);
       } )
  }

  getContacts(): Contact[] {
    return this.contacts.slice();
  }

  getContact(id: string): Contact | null {
    return this.contacts.find(contact => contact.id === id) || null;
  }

  
  deleteContact(contact: Contact | null) {

    if (!contact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === contact.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.httpClient.delete('http://localhost:3000/contacts/' + contact.id)
      .subscribe(
        () => {
          this.contacts.splice(pos, 1);
          this.sortAndSend();
        }
      );
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

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }

    // make sure id of the new Contact is empty
    contact.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.httpClient.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
      contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new contact to contacts
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        }
      );
  }

  updateContact(originalContact: Contact | null, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }

    const pos = this.contacts.findIndex(d => d.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Contact to the id of the old Contact
    newContact.id = originalContact.id;
    newContact._id = originalContact._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    // update database
    this.httpClient.put('http://localhost:3000/contacts/' + originalContact.id,
      newContact, { headers: headers })
      .subscribe(
        () => {
          console.log(newContact);
          this.contacts[pos] = newContact;
          this.sortAndSend();
        }
      );
  }
}
