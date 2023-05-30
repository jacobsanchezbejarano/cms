import { Component, OnInit } from '@angular/core';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WindRefService } from 'src/app/wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  document!: Document | null;
  id!: string;
  nativeWindow: any;

  constructor(private documentService: DocumentService, 
    private windRefService: WindRefService,
    private route: ActivatedRoute,
    private router: Router){
      this.nativeWindow = this.windRefService.getNativeWindow();
  }

  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.id = params['id'];
        if(this.id != null && this.documentService.getDocument(this.id) != null){
          this.document = this.documentService.getDocument(this.id);
        }
      });
  }

  onView(){
    if(this.document?.url){
      this.nativeWindow.open(this.document.url);
    }
  }

  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
 }
}
