import { Component } from '@angular/core';
import { OhmGrid } from 'src/app/3_Super/OhmGrid';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'DemandesAlertes',
  templateUrl: './DemandesAlertes.component.html',
  styleUrls: ['./DemandesAlertes.component.scss']
})

export class DemandesAlertesComponent extends OhmGrid {

  /* #region init & loading  */

  override loadParameters(): void {
    this.entityName = environment.alert;
  }

  /* #endregion */

}

