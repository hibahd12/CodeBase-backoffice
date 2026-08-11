import { Component } from '@angular/core';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { OhmGrid } from 'src/app/3_Super/OhmGrid';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'AlerteSanitaire',
  templateUrl: './AlerteSanitaire.component.html',
  styleUrls: ['./AlerteSanitaire.component.scss']
})

export class AlerteSanitaireComponent extends OhmGrid {

  /* #region Variables */

  typeSanitaire= environment.idTypeSanitaire;

  /* #endregion */

  /* #region init & loading  */

  override loadParameters(): void {
    this.entityName = environment.entityNameAlerteSanitaire;
  }

  /* #endregion */

  /* #region Events */

  deleteAlerteScientifique(alerte: any) {
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
          entity: alerte,
          entityName: this.entityName,
          databaseProvider: "mongodb",
          primaryKeyName: "_id",
          primaryKeyValue: alerte._id
        }
        this.ystanceService.apiHandler(YstanceEndPoints.deleteItem, args).subscribe(this.onSuccessDeleteAlerte, YstanceHelper.onErrorResponse);
      }
    });
  }

  /* #endregion */

  /* #region arrow functions */

  onSuccessDeleteAlerte = (response: any) => {
    Swal.fire({
      title: 'Suppression',
      text: 'Alerte supprimée avec succès',
      icon: 'success',
      confirmButtonText: 'OK'
    }).then(() => {
      this.loadData();
    });
  }

}

