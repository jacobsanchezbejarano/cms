import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact!: Contact | null;
  contact!: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id!: string;
  
  constructor(
       private contactService: ContactService,
       private router: Router,
       private route: ActivatedRoute) {
       }

  ngOnInit() {
    this.route.params.subscribe (
      (params: Params) => {
         let id = params['id'];
         if (id == undefined || id == null) {
            this.editMode = false;
            return
         }

         this.originalContact = this.contactService.getContact(id)
         if (this.originalContact == undefined || this.originalContact == null){
          return;
         }

         this.editMode = true;
         this.contact = JSON.parse(JSON.stringify(this.originalContact));
   
         if (this.contact.group != null && this.contact.group != undefined) {
            this.groupContacts = this.contact.group;
        }
    }) 
  }

  onRemoveItem(i: any) {
    console.log(i);
  }

  onSubmit(form: NgForm) {
    let value = form.value // get values from form’s fields
    let newContact = new Contact(value.id, value.name, value.email, value.phone, value.imageUrl, value.group);
    if (this.editMode == true) {
      this.contactService.updateDocument(this.originalContact, newContact);
    } else {
      this.contactService.addDocument(newContact);
    }
    this.router.navigate(['/contacts']); 
  }

  onCancel() {
    this.router.navigate(['/contacts']); 
  }
}
