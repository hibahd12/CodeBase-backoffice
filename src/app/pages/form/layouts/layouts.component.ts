import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { YstanceEndPoints } from 'src/app/Ystance/YstanceEndPoints';
import { YstanceHelper } from 'src/app/Ystance/YstanceHelper';
import { YstanceService } from 'src/app/Ystance/YstanceService';

@Component({
  selector: 'app-layouts',
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.scss']
})
export class LayoutsComponent implements OnInit {

  /* #region Variables */

  breadCrumbItems: Array<{}>;
  Date: string = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  _idtype: string;
  nameOfAlert: string;
  selectedType: string;
  SelectedCategoryObject: string;
  typeAlertes: any[] = [];
  AllDemandesAlerts: any[] = [];
  Categories: any[] = [];
  Emetteur: string;
  category: string;
  selectedSpecie: string;
  selectedPort: string;
  observation: string;
  nature: string;
  Natures = [
    { id: 'public', name: 'public' },
    { id: 'scientifique', name: 'scientifique' },
  ];
  Emetteurs: any = [
    { id: 'Emetteur 1', name: 'Emetteur 1' },
    { id: 'Emetteur 2', name: 'Emetteur 2' },
    { id: 'Emetteur 3', name: 'Emetteur 3' },
    { id: 'Emetteur 4', name: 'Emetteur 4' }
  ];
  Species: any[] = [];
  Ports: any[] = [];

  /* #endregion */

  /* #region Constructor  */

  constructor(
    private router: Router,
    private ystanceService: YstanceService
  ) { }

  /* #endregion */

  /* #region Init & Loading */

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Form Elements', active: true }];
    this.GetTypesAlert();
    this.GetSpecies();
    this.GetPorts();
    this.GetAllAlert();
  }

  GetSpecies() {
    let user: any = JSON.parse(sessionStorage.getItem('currentUser')!);
    let args = {
            thirdPartyEndPointName: 'GetSpecies',
      thirdPartyEndpointQueryParams: '?page=1&perPage=1000'
    };
    this.ystanceService.apiHandler(YstanceEndPoints.thirdPartyEndPointHandler, args).subscribe(this.OnSuccessGetSpecies);
  }

  GetPorts() {
    let user: any = JSON.parse(sessionStorage.getItem('currentUser')!);
    let args = {
            thirdPartyEndPointName: 'GetPorts',
      thirdPartyEndpointQueryParams: '?page=1&perPage=1000'
    };
    this.ystanceService.apiHandler(YstanceEndPoints.thirdPartyEndPointHandler, args).subscribe(this.OnSuccessGetPorts);
  }

  GetTypesAlert() {
    let allParams = this.BuildGetTypeAlert();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.OnSuccessGetTypeAlert, YstanceHelper.onErrorResponse);
  }

  GetCategory() {
    let allParams = this.BuildGetCategory();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.OnSuccessGetCategory, YstanceHelper.onErrorResponse);
  }

  GetAllAlert() {
    let allParams = this.BuildGetAllAlert();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.OnSuccessGetAllAlert, YstanceHelper.onErrorResponse);
  }

  /* #endregion */

  /* #region Popup */

  onTabChangeType(event: any) {
    this._idtype = event.id
    this.selectedType = event.name
    this.GetCategory();
  }

  onTabChangeCategory(event: any) {
    this.category = event.name
    this.SelectedCategoryObject = event;
  }

  SaveCategory() {
    let allParams = this.BuildInsertCategory();
    this.ystanceService.apiHandler(YstanceEndPoints.insertItem, allParams).subscribe(this.OnSuccessSaveCategory, YstanceHelper.onErrorResponse);
  }

  SaveAlert() {
    let allParams = this.BuildInsertAlert();
    this.ystanceService.apiHandler(YstanceEndPoints.insertItem, allParams).subscribe(this.OnSuccessSaveAlert, YstanceHelper.onErrorResponse);
  }

  AddNewAlert(): void {
    this.router.navigate(['/form/layouts']);
  }

  /* #endregion */

  /* #region Build Params */

  BuildInsertCategory() {
    let entity = {
      id: YstanceHelper.newGuid(),
      name: this.category,
      idtype: this._idtype,
    };
    let args = {
      entityChanges: entity,
      entityName: 'category',
      databaseProvider: 'mongodb'
    }
    return args;
  }

  BuildInsertAlert() {
    let entity = {
      id: YstanceHelper.newGuid(),
      name: this.nameOfAlert,
      date: this.Date,
      emetteur: this.Emetteur,
      nature: this.nature,
      category: this.SelectedCategoryObject,
      specie: this.selectedSpecie,
      port: this.selectedPort,
      observation: this.observation,

    };
    let args = {
      entityChanges: entity,
      entityName: 'alerte',
      databaseProvider: 'mongodb'
    }
    return args;
  }

  BuildGetCategory() {
    let args = {
            filters: [
        { property: 'idtype', value: this._idtype }
      ],
      entityName: "category",
      databaseProvider: "mongodb"
    }
    return args;
  }

  BuildGetTypeAlert() {
    let args = {
            filters: [],
      entityName: "type",
      databaseProvider: "mongodb"
    }
    return args;
  }

  BuildGetAllAlert() {
    let args = {
            filters: [],
      entityName: "alerte",
      databaseProvider: "mongodb"
    }
    return args;
  }

  /* #endregion */

  /* #region Arrow functions  */

  OnSuccessGetSpecies = (data: any) => {
    this.Species = data.species
  }

  OnSuccessGetPorts = (data: any) => {
    this.Ports = data.ports
  }

  OnSuccessSaveCategory = (data: any) => {
    this.category = '';
    this.GetTypesAlert();
  }

  OnSuccessGetTypeAlert = (data: any) => {
    this.typeAlertes = data
  }

  OnSuccessGetCategory = (data: any) => {
    this.Categories = data
  }

  OnSuccessSaveAlert = (data: any) => {
  }

  OnSuccessGetAllAlert = (data: any) => {
    this.AllDemandesAlerts = data
  }

  /* #endregion */

}