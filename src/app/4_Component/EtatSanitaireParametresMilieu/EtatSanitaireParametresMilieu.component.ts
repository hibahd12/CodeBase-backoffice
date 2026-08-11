import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { OhmForm } from 'src/app/3_Super/OhmForm';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'EtatSanitaireParametresMilieu',
  templateUrl: './EtatSanitaireParametresMilieu.component.html',
  styleUrls: ['./EtatSanitaireParametresMilieu.component.scss']
})

export class EtatSanitaireParametresMilieuComponent extends OhmForm implements OnChanges {

  /* #region Variables */

  environment = environment;
  @Input() pointSuivi: any;
  @Input() zoneSanitaire: any;
  @Input() regionSanitaire: any;

  /* #endregion */

  /* #region Init and Loading */

  override initialisationParametres() {
    this.entityName = environment.entityNameEtatSanitaire;
    this.mode = 'Edit';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pointSuivi && !changes.pointSuivi.firstChange) {
      this.loadDataItem();
    }
  }

  override initializeFormBuilder(entity: any): void {
    this.form = this.formBuilder.group({
      'dateMesureMilieu': new FormControl(new Date().toISOString().substring(0, 10), Validators.required),
      'temperature': new FormControl(null, [Validators.required]),
      'salinite': new FormControl(null, [Validators.required]),
      'ph': new FormControl(null, [Validators.required]),
      'oxygeneDissous': new FormControl(null, [Validators.required]),
    });
    if (entity != null) {
      const selectedZone = entity.zones.find((zone: any) => zone.title === this.zoneSanitaire.title);
      const selectedPointSuivi = selectedZone.point_suivi.find((ps: any) => ps.title === this.pointSuivi.title);
      this.form.patchValue({
        'dateMesureMilieu': selectedPointSuivi?.parametreDeMilieu?.dateMesureMilieu || new Date().toISOString().substring(0, 10),
        'temperature': selectedPointSuivi?.parametreDeMilieu?.temperature || null,
        'salinite': selectedPointSuivi?.parametreDeMilieu?.salinite || null,
        'ph': selectedPointSuivi?.parametreDeMilieu?.ph || null,
        'oxygeneDissous': selectedPointSuivi?.parametreDeMilieu?.oxygeneDissous || null
      });
    }
    this.setCurrentFormValue();
  }

  override buildParamsUpdateItem(entity: any) {
    const selectedZone = this.regionSanitaire.zones.find((zone: any) => zone.title === this.zoneSanitaire.title);
    const selectedPointSuivi = selectedZone.point_suivi.find((ps: any) => ps.title === this.pointSuivi.title);
    selectedPointSuivi.parametreDeMilieu = { ...entity };
    return {
      entityChanges: this.regionSanitaire,
      entityName: this.entityName,
      databaseProvider: 'mongodb',
      primaryKeyName: '_id',
      primaryKeyValue: this.regionSanitaire._id
    };
  }

  /* #endregion */

}