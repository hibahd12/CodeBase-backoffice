import { Component } from '@angular/core';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { OhmGrid } from 'src/app/3_Super/OhmGrid';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'AvisScientifiques',
  templateUrl: './AvisScientifiques.component.html',
  styleUrls: ['./AvisScientifiques.component.scss']
})

export class AvisScientifiquesComponent extends OhmGrid {

  /* #region init & loading  */

  override loadParameters(): void {
    this.entityName = environment.entityNameAvisScientifique;
    this.orderByField = "dateCreation";
    this.orderByDirection = "desc";
  }

  /* #endregion */

  /* #region events  */

  deleteAvis(avis: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Vous ne pourrez pas annuler cela!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        let args = {
          entity: avis,
          entityName: this.entityName,
          databaseProvider: "mongodb",
          primaryKeyName: "_id",
          primaryKeyValue: avis._id
        }
        this.ystanceService.apiHandler(YstanceEndPoints.deleteItem, args).subscribe(this.onSuccessDeleteAvis, YstanceHelper.onErrorResponse);
      }
    });
  }

  onSuccessDeleteAvis = (response: any) => {
    Swal.fire({
      title: 'Suppression',
      text: 'Avis supprimée avec succès',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      this.loadData();
    });
  }

  /* #endregion */

}

