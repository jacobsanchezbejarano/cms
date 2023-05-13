import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();
  
  documents: Document[] = [
    new Document(1, "Doc 1","Doc desc 1","http://www.asdasd.com","NA"),
    new Document(2,"Doc 2","Doc desc 2","http://www.asdasd2.com","NA"),
    new Document(3,"Doc 3","Doc desc 3","http://www.asdasd3.com","NA"),
    new Document(4,"Doc 4","Doc desc 4","http://www.asdasd4.com","NA"),
  ];

  onSelectedDocument(document: Document){
    this.selectedDocumentEvent.emit(document);
  }

}
