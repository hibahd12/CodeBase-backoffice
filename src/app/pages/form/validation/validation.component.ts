import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { YstanceEndPoints } from 'src/app/Ystance/YstanceEndPoints';
import { YstanceHelper } from 'src/app/Ystance/YstanceHelper';
import { YstanceService } from 'src/app/Ystance/YstanceService';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})

export class ValidationComponent implements OnInit {

  /* #region Variables */

  breadCrumbItems: Array<{}>;
  Date: string = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  typeAlertes: any[] = [];
  selectedType: string;
  Objectif: string;
  Remarque: string;
  selectedPort: string;
  Ports: any[] = [];

  /* #endregion */

  /* #region Constructor  */

  constructor(
    private ystanceService: YstanceService
  ) { }

  /* #endregion */

  /* #region Init & Loading */

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Form Validation', active: true }];
    this.GetPorts();
    this.GetTypesAlert();
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

  /* #endregion */

  /* #region Build Params */

  BuildGetTypeAlert() {
    let args = {
            filters: [],
      entityName: "type",
      databaseProvider: "mongodb"
    }
    return args;
  }
  
  /* #endregion */

  /* #region Arrow Function */

  OnSuccessGetPorts = (data: any) => {
    this.Ports = data.ports
  }

  OnSuccessGetTypeAlert = (data: any) => {
    this.typeAlertes = data
  }
  
  /* #endregion */

}
