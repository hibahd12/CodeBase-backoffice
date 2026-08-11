import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { OhmForm } from 'src/app/3_Super/OhmForm';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'EtatSanitairePhytoplancton',
  templateUrl: './EtatSanitairePhytoplancton.component.html',
  styleUrls: ['./EtatSanitairePhytoplancton.component.scss']
})

export class EtatSanitairePhytoplanctonComponent extends OhmForm {

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
    if (this.formLoaded == false) {
      this.form = this.formBuilder.group({
        'dateEchantillonnagePhytop': new FormControl(new Date().toISOString().substring(0, 10), Validators.required),
        'niveauAlertePhytoplancton': new FormControl('', Validators.required),
        'especeResponsablePrealerte': new FormControl(''),
        'pseudoNitzschiaSpp': new FormControl('', Validators.required),
        'dinophysisSpp': new FormControl('', Validators.required),
        'prorocentrumLima': new FormControl('', Validators.required),
        'alexandriumSpp': new FormControl('', Validators.required),
        'protoceratiumReticulatum': new FormControl('', Validators.required),
        'lingulodiniumPolyedrum': new FormControl('', Validators.required),
        'gonyaulaxSpinifera': new FormControl('', Validators.required),
        'gymnodiniumCatenatum': new FormControl('', Validators.required),
        'azadiniumSpinosum': new FormControl('', Validators.required),
      });
    }
    if (entity != null) {      
      const selectedZone = entity.zones.find((zone: any) => zone.title === this.zoneSanitaire.title);      
      const selectedPointSuivi = selectedZone.point_suivi.find((ps: any) => ps.title === this.pointSuivi.title);            
        this.form.patchValue({
          'dateEchantillonnagePhytop': selectedPointSuivi?.phytoplancton?.dateEchantillonnagePhytop || new Date().toISOString().substring(0, 10),
          'niveauAlertePhytoplancton': selectedPointSuivi?.phytoplancton?.niveauAlertePhytoplancton ?? '',
          'especeResponsablePrealerte': selectedPointSuivi?.phytoplancton?.especeResponsablePrealerte ?? '',
          'pseudoNitzschiaSpp': selectedPointSuivi?.phytoplancton?.pseudoNitzschiaSpp ?? '',
          'dinophysisSpp': selectedPointSuivi?.phytoplancton?.dinophysisSpp ?? '',
          'prorocentrumLima': selectedPointSuivi?.phytoplancton?.prorocentrumLima ?? '',
          'alexandriumSpp': selectedPointSuivi?.phytoplancton?.alexandriumSpp ?? '',
          'protoceratiumReticulatum': selectedPointSuivi?.phytoplancton?.protoceratiumReticulatum ?? '',
          'lingulodiniumPolyedrum': selectedPointSuivi?.phytoplancton?.lingulodiniumPolyedrum ?? '',
          'gonyaulaxSpinifera': selectedPointSuivi?.phytoplancton?.gonyaulaxSpinifera ?? '',
          'gymnodiniumCatenatum': selectedPointSuivi?.phytoplancton?.gymnodiniumCatenatum ?? '',
          'azadiniumSpinosum': selectedPointSuivi?.phytoplancton?.azadiniumSpinosum ?? '',
        });
    }
    this.setCurrentFormValue();
  }

  override buildParamsUpdateItem(entity: any) {
    const selectedZone = this.regionSanitaire.zones.find((zone: any) => zone.title === this.zoneSanitaire.title);
    const selectedPointSuivi = selectedZone.point_suivi.find((ps: any) => ps.title === this.pointSuivi.title);
    selectedPointSuivi.phytoplancton = { ...entity };
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
