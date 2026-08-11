import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { OhmForm } from 'src/app/3_Super/OhmForm';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'EtatSanitaireBiotoxineEspece1',
  templateUrl: './EtatSanitaireBiotoxineEspece1.component.html',
  styleUrls: ['./EtatSanitaireBiotoxineEspece1.component.scss']
})
export class EtatSanitaireBiotoxineEspece1Component extends OhmForm {

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
    if (this.formLoaded == false) {
      this.form = this.formBuilder.group({
        'typeTest': new FormControl('Biologique', Validators.required),
        'dateEchantillonnageEspece1': new FormControl(new Date().toISOString().substring(0, 10), Validators.required),
        'niveauAlerteBiotoxine1': new FormControl('', Validators.required),
        'lspEspece1': new FormControl(''),
        'lsp1AcideOkadaique': new FormControl(''),
        'lsp1AcideAzaspiracides': new FormControl(''),
        'lsp1Yessotoxines': new FormControl(''),
        'pspEspece1': new FormControl(''),
        'asp1': new FormControl(''),
      });
    }
    if (entity != null) {
      const selectedZone = entity.zones.find((zone: any) => zone.title === this.zoneSanitaire.title);
      const selectedPointSuivi = selectedZone.point_suivi.find((ps: any) => ps.title === this.pointSuivi.title);
      this.form.patchValue({
        'typeTest': selectedPointSuivi?.biotoxineEspece1?.typeTest || 'Biologique',
        'dateEchantillonnageEspece1': selectedPointSuivi?.biotoxineEspece1?.dateEchantillonnageEspece1 || new Date().toISOString().substring(0, 10),
        'niveauAlerteBiotoxine1': selectedPointSuivi?.biotoxineEspece1?.niveauAlerteBiotoxine1 || '',
        'lspEspece1': selectedPointSuivi?.biotoxineEspece1?.lspEspece1 || '',
        'lsp1AcideOkadaique': selectedPointSuivi?.biotoxineEspece1?.lsp1AcideOkadaique || 0,
        'lsp1AcideAzaspiracides': selectedPointSuivi?.biotoxineEspece1?.lsp1AcideAzaspiracides || 0,
        'lsp1Yessotoxines': selectedPointSuivi?.biotoxineEspece1?.lsp1Yessotoxines || 0,
        'pspEspece1': selectedPointSuivi?.biotoxineEspece1?.pspEspece1 || 0,
        'asp1': selectedPointSuivi?.biotoxineEspece1?.asp1 || 0,
      });      
    }
    this.setCurrentFormValue();
  }

  onTestTypeChange(type: string) {
    if (type === 'Biologique') {
      this.form.get('lspEspece1')?.setValidators([Validators.required]);
      this.form.get('lsp1AcideOkadaique')?.clearValidators();
      this.form.get('lsp1AcideAzaspiracides')?.clearValidators();
      this.form.get('lsp1Yessotoxines')?.clearValidators();
      this.form.get('pspEspece1')?.clearValidators();
      this.form.get('asp1')?.clearValidators();
    } else {
      this.form.get('lspEspece1')?.clearValidators();
      this.form.get('lsp1AcideOkadaique')?.setValidators([Validators.required]);
      this.form.get('lsp1AcideAzaspiracides')?.setValidators([Validators.required]);
      this.form.get('lsp1Yessotoxines')?.setValidators([Validators.required]);
      this.form.get('pspEspece1')?.setValidators([Validators.required]);
      this.form.get('asp1')?.setValidators([Validators.required]);
    }
    this.form.get('lspEspece1')?.updateValueAndValidity();
    this.form.get('lsp1AcideOkadaique')?.updateValueAndValidity();
    this.form.get('lsp1AcideAzaspiracides')?.updateValueAndValidity();
    this.form.get('lsp1Yessotoxines')?.updateValueAndValidity();
    this.form.get('pspEspece1')?.updateValueAndValidity();
    this.form.get('asp1')?.updateValueAndValidity();
  }

  override buildParamsUpdateItem(entity: any) {
    const selectedZone = this.regionSanitaire.zones.find((zone: any) => zone.title === this.zoneSanitaire.title);
    const selectedPointSuivi = selectedZone.point_suivi.find((ps: any) => ps.title === this.pointSuivi.title);
    selectedPointSuivi.biotoxineEspece1 = { ...entity };
    return {
      entityChanges: this.regionSanitaire,
      entityName: this.entityName,
      databaseProvider: 'mongodb',
      primaryKeyName: '_id',
      primaryKeyValue: this.idEntity
    };
  }
}

