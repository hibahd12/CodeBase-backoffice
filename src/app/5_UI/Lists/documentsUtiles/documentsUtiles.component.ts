import { Component } from '@angular/core';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { OhmGrid } from 'src/app/3_Super/OhmGrid';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-documents-utiles',
  templateUrl: './documentsUtiles.component.html',
  styleUrls: ['./documentsUtiles.component.scss']
})
export class DocumentsUtilesComponent extends OhmGrid{
  
  /* #region Variables */


  /* #endregion */

  /* #region init & loading  */

  override loadParameters(): void {
    this.entityName = environment.entityNameDocumentUtile;
  }

  /* #endregion */

  /* #region Events */

  telechargerDocument(document: any) {   
    let args = {
        entityName: "attachement",
        databaseProvider: "mongodb",
        filters: [
          {
            property: "metadatas.idparent",
            value: document.id,
          },
          {
            property: "metadatas.type",
            value: "documentutile"
          }
        ],
      }
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, args).subscribe(this.onSuccessDownloadDocument, YstanceHelper.onErrorResponse);
  }
  
  onSuccessDownloadDocument = (data: any) => {    
    data.forEach((item: any) => {
      const dataURI = "data:" + item.contenttype + ";base64," + item.content;
      try {
        saveAs(dataURI, item.name);
      } catch (error) {
      }
    });
  }
  
  deleteRow(document: any) { 
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer ce document?',
      showCancelButton: true,
      confirmButtonText: `Supprimer`,
      cancelButtonText: `Annuler`,
    }).then((result) => {
      if (result.isConfirmed) {
        let args = {
          entity: document,
          entityName: this.entityName,
          databaseProvider: "mongodb",
          primaryKeyName: "_id",
          primaryKeyValue: document._id
        }
        this.ystanceService.apiHandler(YstanceEndPoints.deleteItem, args).subscribe(this.onSuccessDeleteDocument, YstanceHelper.onErrorResponse);
      }
    })
  }

  /* #endregion */
  
  /* #region arrow functions */
  
  onSuccessDeleteDocument = (response: any) => { 
    Swal.fire('Document supprimé avec succès', '', 'success');
    this.loadData();
  }
 

}
