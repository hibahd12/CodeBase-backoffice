import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { OhmForm } from 'src/app/3_Super/OhmForm';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'EtatSanitaireContamiChimique',
  templateUrl: './EtatSanitaireContamiChimique.component.html',
  styleUrls: ['./EtatSanitaireContamiChimique.component.scss']
})

export class EtatSanitaireContamiChimiqueComponent extends OhmForm {

  /* #region Variables */

  environment = environment;
  @Input() pointSuivi: any;
  @Input() zoneSanitaire: any;
  @Input() regionSanitaire: any;
  LabosResponsables: any[] = [];

  /* #endregion */

  /* #region Init and Loading */

  override initialisationParametres() {
    this.entityName = environment.entityNameEtatSanitaire;
    this.mode = 'Edit';
    this.getLabosResponsables();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.pointSuivi && !changes.pointSuivi.firstChange) {
      this.loadDataItem();
    }
  }

  override initializeFormBuilder(entity: any): void {
    this.form = this.formBuilder.group({
      'dateEchantillonnageChimi1': new FormControl(new Date().toISOString().substring(0, 10), Validators.required),
      'dateEchantillonnageChimi2': new FormControl(new Date().toISOString().substring(0, 10)),
      'cd': new FormControl('', Validators.required),
      'pb': new FormControl('', Validators.required),
      'hg': new FormControl('', Validators.required),
      'hap': new FormControl(''),
      'pcb': new FormControl(''),
      'dioxines': new FormControl(''),
      'dioxinesAndPcbTypeDioxine': new FormControl(''),
      'idLaboResponsable': new FormControl(this.zoneSanitaire.idLaboResponsable, Validators.required),
    });

    if (entity != null) {
      const selectedZone = entity.zones.find((zone: any) => zone.title === this.zoneSanitaire.title);
      const selectedPointSuivi = selectedZone.point_suivi.find((ps: any) => ps.title === this.pointSuivi.title);
      this.form.patchValue({
        'dateEchantillonnageChimi1': selectedPointSuivi?.contaminantChimique?.dateEchantillonnageChimi1 || new Date().toISOString().substring(0, 10),
        'dateEchantillonnageChimi2': selectedPointSuivi?.contaminantChimique?.dateEchantillonnageChimi2 || new Date().toISOString().substring(0, 10),
        'cd': selectedPointSuivi?.contaminantChimique?.cd ?? '',
        'pb': selectedPointSuivi?.contaminantChimique?.pb ?? '',
        'hg': selectedPointSuivi?.contaminantChimique?.hg ?? '',
        'hap': selectedPointSuivi?.contaminantChimique?.hap ?? '',
        'pcb': selectedPointSuivi?.contaminantChimique?.pcb ?? '',
        'dioxines': selectedPointSuivi?.contaminantChimique?.dioxines ?? '',
        'dioxinesAndPcbTypeDioxine': selectedPointSuivi?.contaminantChimique?.dioxinesAndPcbTypeDioxine ?? '',
        'idLaboResponsable': selectedPointSuivi?.contaminantChimique?.idLaboResponsable || this.zoneSanitaire.idLaboResponsable,
      });
    }
    this.setCurrentFormValue();
  }

  override buildParamsUpdateItem(entity: any) {
    const selectedZone = this.regionSanitaire.zones.find((zone: any) => zone.title === this.zoneSanitaire.title);
    const selectedPointSuivi = selectedZone.point_suivi.find((ps: any) => ps.title === this.pointSuivi.title);
    selectedPointSuivi.contaminantChimique = { ...entity };
    return {
      entityChanges: this.regionSanitaire,
      entityName: this.entityName,
      databaseProvider: 'mongodb',
      primaryKeyName: '_id',
      primaryKeyValue: this.idEntity
    };
  }

  getLabosResponsables() {
    let allParams = this.buildArgsLabosResponsables();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessGetLabosResponsables, YstanceHelper.onErrorResponse);
  }

  /* #endregion */

  /* #region Events */

  onAddItem(event: any) {
    let newEntity = {
      title: event.NameItem,
    };
    event.OhmComponent.insertNewItem(newEntity);
  }

  /* #endregion */

  /* #region Build Args */

  buildArgsLabosResponsables() {
    let args = {
      entityName: environment.entityNameLaboResponsable,
      databaseProvider: "mongodb",
      filters: [],
    }
    return args;
  }

  /* #endregion */

  /* #region Arrow functions */

  onSuccessGetLabosResponsables = (data: any) => {
    this.LabosResponsables = data
  }

  /* #endregion */

}
