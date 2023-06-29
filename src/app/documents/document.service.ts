import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Document } from './document.model';
// import {MOCKDOCUMENTS} from './MOCKDOCUMENTS';
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
    .get<Document[]>('http://localhost:3000/documents')
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
      this.httpClient.put('http://localhost:3000/documents',
      data, { headers: headers }).subscribe(
        response => {
          let documentsListClone = this.documents.slice().sort((a, b) => a.name.localeCompare(b.name));
          this.documentListChangedEvent.next(documentsListClone);
        }
      )
    }

    sortAndSend(){
      this.httpClient
      .get<Document[]>('http://localhost:3000/documents')
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

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string): Document | null {
    return this.documents.find(document => document.id === id) || null;
  }

  
  deleteDocument(document: Document | null) {

    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.httpClient.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        () => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        }
      );
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

  

  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.httpClient.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
          this.sortAndSend();
        }
      );
  }

  
  updateDocument(originalDocument: Document | null, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;
    newDocument._id = originalDocument._id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.httpClient.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        () => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        }
      );
  }

}
