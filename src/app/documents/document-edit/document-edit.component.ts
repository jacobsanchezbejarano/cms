import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DocumentService } from '../document.service';
import { Document } from '../document.model';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {

  @ViewChild('f') dForm!: NgForm;
  originalDocument!: Document | null;
  document!: Document;
  id!: string;
  editMode: boolean = false;


  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe (
      (params: Params) => {
         this.id = params['id'];
         if (this.id == undefined || this.id == null) {
          this.editMode = false
          return
         }

         this.originalDocument = this.documentService.getDocument(this.id) || null;
        
         if (this.originalDocument == undefined || this.originalDocument == null) {
          return;
         }

         this.editMode = true;
         this.document = JSON.parse(JSON.stringify(this.originalDocument));
         
        
    });
  }

  onSubmit(form: NgForm) {
    let value = form.value // get values from form’s fields
    let newDocument = new Document(value.id, value.name, value.description, value.url, value.children);
    if (this.editMode == true) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }
    this.router.navigate(['/documents']); 
  }

  onCancel() {
    this.router.navigate(['/documents']); 
  }
}
