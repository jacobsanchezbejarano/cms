import { EventEmitter, Injectable, Output } from '@angular/core';
import { Document } from './document.model';
import {MOCKDOCUMENTS} from './MOCKDOCUMENTS';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  @Output() documentSelectedEvent = new EventEmitter<Document>();
  @Output() documentChangedEvent = new EventEmitter<Document[]>();
  documentListChangedEvent = new Subject<Document[]>();
  
  documents: Document[] = [];
  maxDocumentId!: number;

  constructor() { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
   }

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string): Document | null {
    return this.documents.find(document => document.id === id) || null;
  }

  deleteDocument(document: Document | null) {
    if (document == undefined || null) {
       return;
    }
    const pos = this.documents.indexOf(document);
    if (pos < 0) {
       return;
    }
    this.documents.splice(pos, 1);
    let documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
 }

 
  getMaxId(): number {

      let maxId = 0

      this.documents.forEach(document =>{
        let currentId = +document.id
          if (currentId > maxId){
            maxId = currentId;
          }
              
      })

      return maxId;
  }

  
  addDocument(newDocument: Document) {
    if (newDocument == undefined || null) {
      return
    }

    this.maxDocumentId++
    newDocument.id = ""+this.maxDocumentId;
    this.documents.push(newDocument);
    let documentsListClone = this.documents.slice();
    this.documentListChangedEvent.next(documentsListClone);
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
      if ((originalDocument == undefined || null) || (newDocument == undefined || null)){
          return;
      }
      
      let pos = this.documents.indexOf(originalDocument)
      if (pos < 0){
        return;
      }

      newDocument.id = originalDocument.id;
      this.documents[pos] = newDocument;
      let documentsListClone = this.documents.slice()
      this.documentListChangedEvent.next(documentsListClone)
  }

}
