import { Component } from '@angular/core';
import { Contact } from '../contact-list/contact.model';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent {
  contactDetail:Contact = {
        id: 0, 
        name: "", 
        email: "", 
        phone: "", 
        imageUrl: "",
        group: null
  };

  constructor () {

  }
}
