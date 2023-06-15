import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  constructor(private httpClient: HttpClient) { 
    // this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
    this.httpClient
    .get<Document[]>('https://cms-wdd430-jacob-default-rtdb.firebaseio.com/documents.json')
    .subscribe(
       // success method
       (documents: Document[] ) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          const sortedDocuments = documents.slice().sort((a, b) => a.name.localeCompare(b.name));
          this.documentListChangedEvent.next(sortedDocuments);
       },
       // error method
       (error: any) => {
          console.error(error);
       } )
    
   }

   storeDocuments() {
      const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
      let data = JSON.stringify(this.documents);
      this.httpClient.put('https://cms-wdd430-jacob-default-rtdb.firebaseio.com/documents.json',
      data, { headers: headers }).subscribe(
        response => {
          let documentsListClone = this.documents.slice().sort((a, b) => a.name.localeCompare(b.name));
          this.documentListChangedEvent.next(documentsListClone);
        }
      )
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
    this.storeDocuments();
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
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document | null, newDocument: Document) {
      if ((originalDocument == undefined || null) || (newDocument == undefined || null)){
          return;
      }
      
      let pos = this.documents.indexOf(originalDocument)
      if (pos < 0){
        return;
      }

      newDocument.id = originalDocument.id;
      this.documents[pos] = newDocument;
      this.storeDocuments();
  }

}
