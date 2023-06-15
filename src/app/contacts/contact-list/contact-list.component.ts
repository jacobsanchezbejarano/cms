import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit{

  private subscription!: Subscription;
  term!: string;

  constructor (private contactService: ContactService) {

  }

    contacts: Contact[] = [];

    ngOnInit() {
      this.contacts = this.contactService.getContacts();

      this.subscription = this.contactService.contactListChangedEvent
      .subscribe(
        (contactsList: Contact[]) => {
          this.contacts = contactsList;
        }
      )

  }

    onSelected(contact: Contact){
       this.contactService.contactSelectedEvent.emit(contact);
    }

    
    search(value: string) {
      this.term = value;
    }

    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
}
