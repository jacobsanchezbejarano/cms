import { Component, OnInit } from '@angular/core';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  contact!: Contact | null;
  id!: string;

  constructor (private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
    ) {

  }
  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.id = params['id'];
        if(this.id != null && this.contactService.getContact(this.id) != null){
          this.contact = this.contactService.getContact(this.id);
        }
      });
  }

  onDelete(){
    this.contactService.deleteContact(this.contact);
    this.router.navigate(['/contacts']);
  }
  
}
