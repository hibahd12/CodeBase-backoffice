import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { OhmForm } from 'src/app/3_Super/OhmForm';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'EtatSanitaireBiotoxineEspece2',
  templateUrl: './EtatSanitaireBiotoxineEspece2.component.html',
  styleUrls: ['./EtatSanitaireBiotoxineEspece2.component.scss']
})

export class EtatSanitaireBiotoxineEspece2Component extends OhmForm {

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
        'typeTest': new FormControl('Biologique', Validators.required),
        'dateEchantillonnageEspece2': new FormControl(new Date().toISOString().substring(0, 10)),
        'niveauAlerteBiotoxine2': new FormControl(''),
        'lspEspece2': new FormControl(''),
        'lsp2AcideOkadaique': new FormControl(''),
        'lsp2AcideAzaspiracides': new FormControl(''),
        'lsp2Yessotoxines': new FormControl(''),
        'pspEspece2': new FormControl(''),
        'asp2': new FormControl(''),
      });
    }
    if (entity != null) {
      const selectedZone = entity.zones.find((zone: any) => zone.title === this.zoneSanitaire.title);
      const selectedPointSuivi = selectedZone.point_suivi.find((ps: any) => ps.title === this.pointSuivi.title);
      this.form.patchValue({
        'typeTest': selectedPointSuivi?.biotoxineEspece1?.typeTest || 'Biologique',
        'dateEchantillonnageEspece2': selectedPointSuivi?.biotoxineEspece2?.dateEchantillonnageEspece2 || new Date().toISOString().substring(0, 10),
        'niveauAlerteBiotoxine2': selectedPointSuivi?.biotoxineEspece2?.niveauAlerteBiotoxine2 || '',
        'lspEspece2': selectedPointSuivi?.biotoxineEspece2?.lspEspece2 || '',
        'lsp2AcideOkadaique': selectedPointSuivi?.biotoxineEspece2?.lsp2AcideOkadaique || 0,
        'lsp2AcideAzaspiracides': selectedPointSuivi?.biotoxineEspece2?.lsp2AcideAzaspiracides || 0,
        'lsp2Yessotoxines': selectedPointSuivi?.biotoxineEspece2?.lsp2Yessotoxines || 0,
        'pspEspece2': selectedPointSuivi?.biotoxineEspece2?.pspEspece2 || 0,
        'asp2': selectedPointSuivi?.biotoxineEspece2?.asp2 || 0,
      });      
    }
    this.setCurrentFormValue();
  }

  onTestTypeChange(type: string) {
    if (type === 'Biologique') {
      this.form.get('lspEspece2')?.setValidators([]);
      this.form.get('lsp2AcideOkadaique')?.clearValidators();
      this.form.get('lsp2AcideAzaspiracides')?.clearValidators();
      this.form.get('lsp2Yessotoxines')?.clearValidators();
      this.form.get('pspEspece2')?.clearValidators();
      this.form.get('asp2')?.clearValidators();
    } else {
      this.form.get('lspEspece2')?.clearValidators();
      this.form.get('lsp2AcideOkadaique')?.setValidators([Validators.required]);
      this.form.get('lsp2AcideAzaspiracides')?.setValidators([Validators.required]);
      this.form.get('lsp2Yessotoxines')?.setValidators([Validators.required]);
      this.form.get('pspEspece2')?.setValidators([Validators.required]);
      this.form.get('asp2')?.setValidators([Validators.required]);
    }
    this.form.get('lspEspece2')?.updateValueAndValidity();
    this.form.get('lsp2AcideOkadaique')?.updateValueAndValidity();
    this.form.get('lsp2AcideAzaspiracides')?.updateValueAndValidity();
    this.form.get('lsp2Yessotoxines')?.updateValueAndValidity();
    this.form.get('pspEspece2')?.updateValueAndValidity();
    this.form.get('asp2')?.updateValueAndValidity();
  }

  override buildParamsUpdateItem(entity: any) {
    const selectedZone = this.regionSanitaire.zones.find((zone: any) => zone.title === this.zoneSanitaire.title);
    const selectedPointSuivi = selectedZone.point_suivi.find((ps: any) => ps.title === this.pointSuivi.title);
    selectedPointSuivi.biotoxineEspece2 = { ...entity };
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
