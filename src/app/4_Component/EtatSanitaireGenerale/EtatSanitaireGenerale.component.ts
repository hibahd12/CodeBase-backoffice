import { HttpClient } from '@angular/common/http';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { SessionManager } from 'src/app/2_Services/SessionManager';
import { YstanceService } from 'src/app/2_Services/YstanceService';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'EtatSanitaireGenerale',
  templateUrl: './EtatSanitaireGenerale.component.html',
  styleUrls: ['./EtatSanitaireGenerale.component.scss'],
})

export class EtatSanitaireGeneraleComponent {

  /* #region Variables */

  environment = environment;
  zoneEtatSanitaire: FormGroup;
  LabosResponsables: any[] = [];
  PointsSuivi: any[] = [];
  TypesProduction: any[] = [];
  EspecesCibles1: any[] = [];
  EspecesCibles2: any[] = [];
  @Input() zoneSanitaire: any;
  @Input() regionSanitaire: any;
  @Input() form: any;
  pointSuivi: any;
  zonesEtatSanitaire: any
  showDetails: boolean = false;

  /* #endregion */

  /* #region Constructor  */

  constructor(
    private ystanceService: YstanceService,
    public formBuilder: FormBuilder,
    public http: HttpClient,
    public sessionManager: SessionManager,
    public router: Router,

  ) {
    this.zoneEtatSanitaire = this.formBuilder.group({
      idTypeProduction: ['', Validators.required],
      idEspececible1: ['', Validators.required],
      idEspececible2: [''],
      statutSanitaire: ['', Validators.required],
      pointSuivi: ['', Validators.required],
      idLaboResponsable: ['', Validators.required],
      dateStatutSanitaire: [new Date().toISOString().substring(0, 10), Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.zoneSanitaire) {
      if (changes.zoneSanitaire.currentValue === null) {
        this.zoneSanitaire = null;
      }
      this.pointSuivi = null;
      this.updateForm();
    }
  }

  /* #endregion */

  /* #region Init and Loading */

  ngOnInit() {
    this.getTypesProduction();
    this.getEspecesCibles1();
    this.getEspecesCibles2();
    this.getZonesEtatSanitaire();
    this.getLabosResponsables();
  }

  getTypesProduction() {
    let allParams = this.buildArgsTypesProduction();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessGetTypesProduction, YstanceHelper.onErrorResponse);
  }

  getLabosResponsables() {
    let allParams = this.buildArgsLabosResponsables();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessGetLabosResponsables, YstanceHelper.onErrorResponse);
  }

  getEspecesCibles1() {
    let allParams = this.buildArgsEspecesCibles1();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessGetEspecesCibles1, YstanceHelper.onErrorResponse);
  }

  getEspecesCibles2() {
    let allParams = this.buildArgsEspecesCibles2();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessGetEspecesCibles2, YstanceHelper.onErrorResponse);
  }

  getZonesEtatSanitaire() {
    let allParams = this.buildArgsZonesEtatSanitaire();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemByPrimaryKey, allParams).subscribe(this.onSuccessGetZonesEtatSanitaire, YstanceHelper.onErrorResponse);
  }

  /* #endregion */

  /* #region Events */

  onAddItem(event: any) {
    let newEntity = {
      title: event.NameItem,
    };
    event.OhmComponent.insertNewItem(newEntity);
  }

  updateForm() {
    this.zoneEtatSanitaire.patchValue({
      idTypeProduction: this.zoneSanitaire?.idTypeProduction || '',
      idEspececible1: this.zoneSanitaire?.idEspececible1 || '',
      idEspececible2: this.zoneSanitaire?.idEspececible2 || '',
      idLaboResponsable: this.zoneSanitaire?.idLaboResponsable || '',
      statutSanitaire: this.zoneSanitaire?.statutSanitaire || '',
      dateStatutSanitaire: this.zoneSanitaire?.dateStatutSanitaire || ''
    });
  }

  updateDetailsEtatSanitaire() {
    this.router.navigate(['/Sys_DetailsEtatSanitaire', this.regionSanitaire._id, { zoneSanitaire: JSON.stringify(this.zoneSanitaire), pointSuivi: JSON.stringify(this.pointSuivi), regionSanitaire: JSON.stringify(this.regionSanitaire) }]);
  }

  onAddPointSuivi(event: any) {
    const newPointSuivi = [
      {
        "title": event.NameItem,
      },
    ];
    if (!this.zoneSanitaire) return;
    const selectedZone = this.regionSanitaire.zones.find((zone: any) => zone.title === this.zoneSanitaire.title);
    if (!selectedZone) return;
    if (!selectedZone.point_suivi) {
      selectedZone.point_suivi = newPointSuivi;
    } else {
      selectedZone.point_suivi.push(...newPointSuivi);
    }
    this.updateRegionSanitaire(selectedZone, event);
  }

  updateRegionSanitaire(updatedZone: any, event: any) {
    const zoneIndex = this.regionSanitaire.zones.findIndex((zone: any) => zone.title === updatedZone.title);
    if (zoneIndex !== -1) {
      this.regionSanitaire.zones[zoneIndex] = updatedZone;
      event.OhmComponent.updateItem(this.regionSanitaire);
    }
  }

  onPointSuiviChange(event: any) {
    this.pointSuivi = event
  }

  updateZoneSanitaire() {
    const selectedZone = this.zonesEtatSanitaire.find((zone: any) => zone.title === this.zoneSanitaire.title);
    selectedZone['idTypeProduction'] = this.zoneEtatSanitaire.get('idTypeProduction').value
    selectedZone['idEspececible1'] = this.zoneEtatSanitaire.get('idEspececible1').value
    selectedZone['idEspececible2'] = this.zoneEtatSanitaire.get('idEspececible2').value
    selectedZone['statutSanitaire'] = this.zoneEtatSanitaire.get('statutSanitaire').value
    selectedZone['dateStatutSanitaire'] = this.zoneEtatSanitaire.get('dateStatutSanitaire').value
    selectedZone['idLaboResponsable'] = this.zoneEtatSanitaire.get('idLaboResponsable').value
    const zoneIndex = this.regionSanitaire.zones.findIndex((zone: any) => zone.title === this.zoneSanitaire.title);
    if (zoneIndex !== -1) {
      this.regionSanitaire.zones[zoneIndex] = selectedZone;
      this.updateItem(this.regionSanitaire);
    }
  }

  updateItem(item: any) {
    let allParams = this.buildUpdateItem(item);
    this.ystanceService.apiHandler(YstanceEndPoints.updateItemByPrimaryKey, allParams).subscribe(this.onSuccessUpdateItem, YstanceHelper.onErrorResponse);
  }

  /* #endregion */

  /* #region Build Args */

  buildArgsTypesProduction() {
    let args = {
      entityName: environment.entityNameTypeProduction,
      databaseProvider: "mongodb",
      filters: [],
    }
    return args;
  }

  buildArgsLabosResponsables() {
    let args = {
      entityName: environment.entityNameLaboResponsable,
      databaseProvider: "mongodb",
      filters: [],
    }
    return args;
  }

  buildArgsEspecesCibles1() {
    let args = {
      entityName: environment.entityNameEspeceCible1,
      databaseProvider: "mongodb",
      filters: [],
    }
    return args;
  }

  buildArgsEspecesCibles2() {
    let args = {
      entityName: environment.entityNameEspeceCible2,
      databaseProvider: "mongodb",
      filters: [],
    }
    return args;
  }

  buildUpdateItem(Entity: any) {
    let args = {
      entityChanges: Entity,
      entityName: environment.entityNameEtatSanitaire,
      databaseProvider: 'mongodb',
      primaryKeyName: '_id',
      primaryKeyValue: Entity._id
    }
    return args;
  }

  buildArgsZonesEtatSanitaire() {
    let args = {
      entityName: environment.entityNameEtatSanitaire,
      databaseProvider: "mongodb",
      primaryKeyName: "_id",
      primaryKeyValue: this.regionSanitaire?._id
    }
    return args;
  }

  /* #endregion */

  /* #region Arrow funtions */

  onSuccessGetLabosResponsables = (data: any) => {
    this.LabosResponsables = data
  }

  onSuccessGetTypesProduction = (data: any) => {
    this.TypesProduction = data
  }

  onSuccessGetEspecesCibles1 = (data: any) => {
    this.EspecesCibles1 = data
  }

  onSuccessGetEspecesCibles2 = (data: any) => {
    this.EspecesCibles2 = data
  }

  onSuccessUpdateItem = (data: any) => {
    YstanceHelper.notify('Ajouté avec succès', null, 'success', 1800, null);
  }

  onSuccessGetZonesEtatSanitaire = (data: any) => {
    this.zonesEtatSanitaire = data?.zones;
    if (this.zoneSanitaire) {
      this.PointsSuivi = data?.zones.filter((zone: any) => zone.title === this.zoneSanitaire.title)[0]?.point_suivi;
      if (this.PointsSuivi?.length > 0 && !this.pointSuivi) {
        this.pointSuivi = this.PointsSuivi[0];
        setTimeout(() => {
          this.zoneEtatSanitaire.patchValue({ pointSuivi: this.PointsSuivi[0].title });
        });
      }
    }
  }

  /* #endregion */

}




