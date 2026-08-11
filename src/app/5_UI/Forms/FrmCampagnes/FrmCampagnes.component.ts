import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { OhmForm } from 'src/app/3_Super/OhmForm';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'Sys_FrmCampagnes',
  templateUrl: './FrmCampagnes.component.html',
  styleUrls: ['./FrmCampagnes.component.scss']
})

export class FrmCampagnesComponent extends OhmForm {

  /* #region Variables */

  environment = environment;
  campagneFormBuilder: FormGroup;
  regionCompagnes: any[] = [];
  typeCompagnes: any[] = [];
  navires: any[] = [];
  ressourcesCible : any[] = [];

  /* #endregion */

  /* #region Init & Loading */

  override initialisationParametres() {
    this.entityName = environment.entityNameCampagne;
    this.getRegions();
    this.getAllTypeCompagnes();
    this.getAllNavires();
    this.getRessourcesCible();
  }

  override initializeFormBuilder(entity: any): void {
    this.form = this.formBuilder.group({});
    if (this.formLoaded == false) {
      this.form = this.formBuilder.group({
        'dateCreation': new FormControl(new Date().toISOString().substring(0, 10), Validators.required),
        'dateDebut': new FormControl(new Date().toISOString().substring(0, 10), Validators.required),
        'dateFin': new FormControl('', Validators.required),
        'type': new FormControl(''),
        'navire': new FormControl('', Validators.required),
        'region': new FormControl(''),
        'ressourceCible': new FormControl(''),
        'objectif': new FormControl(''),
        'remarque': new FormControl(''),
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

  getRegions() {
    let allParams = this.buildGetRegions();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessGetRegions, YstanceHelper.onErrorResponse);
  }

  getAllTypeCompagnes() {
    let allParams = this.buildGetAllTypeCompagne();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessGetAllTypeCompagnes, YstanceHelper.onErrorResponse);
  }

  getAllNavires() {
    let allParams = this.buildAllNavires();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessGetAllNavires, YstanceHelper.onErrorResponse);
  }

  getRessourcesCible() {
    let allParams = this.buildArgsRessourcesCible();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessGetRessourcesCible, YstanceHelper.onErrorResponse);
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

  /* #region Build Params */

  buildGetAllTypeCompagne() {
    let args = {
      filters: [],
      entityName: environment.entityNameTypeCampagne,
      databaseProvider: "mongodb"
    }
    return args;
  }

  buildGetRegions() {
    let args = {
      filters: [],
      entityName: environment.entityNameRegionCampagne,
      databaseProvider: "mongodb"
    }
    return args;
  }

  buildAllNavires() {
    let args = {
      filters: [],
      entityName: environment.entityNameNavireCampagne,
      databaseProvider: "mongodb"
    }
    return args;
  }

  buildArgsRessourcesCible() {
    let args = {
      filters: [],
      entityName: environment.entityNameRessourceCible,
      databaseProvider: "mongodb"
    }
    return args;
  }

  /* #endregion */

  /* #region Arrow Function */

  onSuccessGetAllTypeCompagnes = (data: any) => {
    this.typeCompagnes = data
  }

  onSuccessGetRegions = (data: any) => {
    this.regionCompagnes = data
  }

  onSuccessGetAllNavires = (data: any) => {
    this.navires = data
  }

  onSuccessGetRessourcesCible = (data: any) => {
    this.ressourcesCible = data
  }

  /* #endregion */

}
