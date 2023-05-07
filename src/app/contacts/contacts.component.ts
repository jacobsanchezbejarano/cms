import { Component, Input } from '@angular/core';
import { Contact } from './contact-list/contact.model';

@Component({
  selector: 'cms-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent {
  @Input() selectedContactEvent!: Contact;
}
