import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { OhmForm } from 'src/app/3_Super/OhmForm';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'EtatSanitaireContamiMicro',
  templateUrl: './EtatSanitaireContamiMicro.component.html',
  styleUrls: ['./EtatSanitaireContamiMicro.component.scss']
})

export class EtatSanitaireContamiMicroComponent extends OhmForm {

  /* #region Variables */

  environment = environment;
  @Input() pointSuivi: any;
  @Input() zoneSanitaire: any;
  @Input() regionSanitaire: any;

  /* #endregion */

  /* #region Init and Loading */

  override initialisationParametres() {
    this.entityName = environment.entityNameEtatSanitaire;
    this.mode = 'Edit'
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pointSuivi && !changes.pointSuivi.firstChange) {
      this.loadDataItem();
    }
  }

  override initializeFormBuilder(entity: any): void {
    this.form = this.formBuilder.group({
      'dateEchantillonnageMicro': new FormControl(new Date().toISOString().substring(0, 10), Validators.required),
      'niveauAlerteEcoli': new FormControl('', Validators.required),
      'escherichiaColi': new FormControl('', Validators.required),
    });
    if (entity != null) {
      const selectedZone = entity.zones.find((zone: any) => zone.title === this.zoneSanitaire.title);
      const selectedPointSuivi = selectedZone.point_suivi.find((ps: any) => ps.title === this.pointSuivi.title);
      this.form.patchValue({
        'dateEchantillonnageMicro': selectedPointSuivi?.contaminantMicro?.dateEchantillonnageMicro || new Date().toISOString().substring(0, 10),
        'niveauAlerteEcoli': selectedPointSuivi?.contaminantMicro?.niveauAlerteEcoli || '',
        'escherichiaColi': selectedPointSuivi?.contaminantMicro?.escherichiaColi ?? '',
      });
    }
    this.setCurrentFormValue();
  }

  override buildParamsUpdateItem(entity: any) {
    const selectedZone = this.regionSanitaire.zones.find((zone: any) => zone.title === this.zoneSanitaire.title);
    const selectedPointSuivi = selectedZone.point_suivi.find((ps: any) => ps.title === this.pointSuivi.title);
    selectedPointSuivi.contaminantMicro = { ...entity };
    return {
      entityChanges: this.regionSanitaire,
      entityName: this.entityName,
      databaseProvider: 'mongodb',
      primaryKeyName: '_id',
      primaryKeyValue: this.idEntity
    };
  }

  /* #endregion */

}

