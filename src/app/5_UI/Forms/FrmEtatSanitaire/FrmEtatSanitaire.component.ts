import { Component, Input, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { OhmForm } from 'src/app/3_Super/OhmForm';
import { EtatSanitaireGeneraleComponent } from 'src/app/4_Component/EtatSanitaireGenerale/EtatSanitaireGenerale.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'Sys_FrmEtatSanitaire',
  templateUrl: './FrmEtatSanitaire.component.html',
  styleUrls: ['./FrmEtatSanitaire.component.scss']
})

export class FrmEtatSanitaireComponent extends OhmForm {

  /* #region Variables */

  @ViewChild(EtatSanitaireGeneraleComponent) EtatSanitaireGeneraleComponent: EtatSanitaireGeneraleComponent;
  regionsEtatSanitaire: any[] = [];
  zonesEtatSanitaire: any[] = [];
  environment = environment;
  regionSanitaire: any;
  zoneSanitaire: any;
  zone: any;
  regionSelected: boolean = false;
  zoneSelected: boolean = false;

  isEditing: boolean = false;
  originalX: number;
  originalY: number;

  /* #endregion */

  /* #region Init and Loading */

  override initialisationParametres() {
    this.entityName = environment.entityNameEtatSanitaire;
    this.getRegionsSanitaire();
    this.getZonesEtatSanitaire();
  }

  override initializeFormBuilder(entity: any): void {
    this.form = this.formBuilder.group({});
    if (this.formLoaded == false) {
      this.form = this.formBuilder.group({
        'date': new FormControl(new Date().toISOString().substring(0, 10), Validators.required),
        'zoneSanitaire': new FormControl('', Validators.required),
        'regionSanitaire': new FormControl('', Validators.required),
        'x': new FormControl(0, Validators.required),
        'y': new FormControl(0, Validators.required)
      });
    } else {
      if (entity != null) {
        for (let prop in entity) {
          this.form.addControl(prop, this.formBuilder.control(entity[prop]));
        }
      }
    }
    this.setCurrentFormValue();
  }

  getZonesEtatSanitaire() {
    let allParams = this.buildArgsZonesEtatSanitaire();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemByPrimaryKey, allParams).subscribe(this.onSuccessGetZonesEtatSanitaire, YstanceHelper.onErrorResponse);
  }

  getRegionsSanitaire() {
    let allParams = this.buildArgsRegionsSanitaire();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessGetRegionsSanitaire, YstanceHelper.onErrorResponse);
  }

  /* #endregion */

  /* #region Events */

  onAddRegion(event: any) {
    let newEntity = {
      title: event.NameItem,
      pin: "circular pin-md"
    };
    event.OhmComponent.insertNewItem(newEntity);
    this.regionSelected = true;
    this.form.get('zoneSanitaire').setValue('');
  }

  onAddZone(event: any) {
    const newZones = [
      {
        "title": event.NameItem,
      },
    ];
    if (!this.regionSanitaire.zones) {
      this.regionSanitaire.zones = newZones;
    } else {
      this.regionSanitaire.zones.push(...newZones);
    }
    event.OhmComponent.updateItem(this.regionSanitaire);
  }

  updateRegionSanitaire(updatedZone: any, event: any) {
    const zoneIndex = this.regionSanitaire.zones.findIndex((zone: any) => zone.title === updatedZone.title);
    if (zoneIndex !== -1) {
      this.regionSanitaire.zones[zoneIndex] = updatedZone;
      event.OhmComponent.updateItem(this.regionSanitaire);
    }
  }

  onRegionFocus(event: any) {
    this.form.get('zoneSanitaire').setValue('');
    this.zonesEtatSanitaire = null;
    this.getZonesEtatSanitaire();
    this.regionSelected = true;
  }

  onRegionChange(event: any) {
    this.regionSanitaire = event;
    this.form.get('zoneSanitaire').setValue('');
    this.zoneSanitaire = null
    this.zonesEtatSanitaire = null;
    this.getZonesEtatSanitaire();
    this.regionSelected = true;
  }

  onZoneChange(event: any) {
    this.zoneSanitaire = event;
    this.zoneSelected = true;
    this.EtatSanitaireGeneraleComponent?.zoneEtatSanitaire.get('pointSuivi').setValue('')
    this.EtatSanitaireGeneraleComponent?.getZonesEtatSanitaire.bind(this.EtatSanitaireGeneraleComponent)()
  }

  updateItem(item: any) {
    let allParams = this.buildUpdateItem(item);
    this.ystanceService.apiHandler(YstanceEndPoints.updateItemByPrimaryKey, allParams).subscribe(this.onSuccessUpdateItem, YstanceHelper.onErrorResponse);
  }

  edit(): void {
    this.originalX = this.regionSanitaire?.x || 0;
    this.originalY = this.regionSanitaire?.y || 0;
    this.isEditing = true;
  }

  save() {
    const newX = this.form.get('x')?.value;
    const newY = this.form.get('y')?.value;
    this.regionSanitaire.pin = "circular pin-md"
    this.regionSanitaire.x = newX !== 0 ? newX : this.regionSanitaire.x;
    this.regionSanitaire.y = newY !== 0 ? newY : this.regionSanitaire.y;
    this.updateItem(this.regionSanitaire);
    this.isEditing = false;
  }

  cancel(): void {
    this.isEditing = false;
    this.regionSanitaire.x = this.originalX;
    this.regionSanitaire.y = this.originalY;
  }

  /* #endregion */

  /* #region Build Args */

  buildArgsRegionsSanitaire() {
    let args = {
      entityName: environment.entityNameEtatSanitaire,
      databaseProvider: "mongodb",
      filters: [],
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

  /* #endregion */

  /* #region Arrow function */

  onSuccessGetZonesEtatSanitaire = (data: any) => {
    this.zonesEtatSanitaire = data?.zones;
  }

  onSuccessGetRegionsSanitaire = (data: any) => {
    this.regionsEtatSanitaire = data;
  }

  onSuccessUpdateItem = (data: any) => {
    YstanceHelper.notify('Successfully updated', null, 'success', 1800, null);
  }
  /* #endregion */

}