import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { YstanceEndPoints } from 'src/app/Ystance/YstanceEndPoints';
import { YstanceHelper } from 'src/app/Ystance/YstanceHelper';
import { YstanceService } from 'src/app/Ystance/YstanceService';

@Component({
  selector: 'app-advancedform',
  templateUrl: './advancedform.component.html',
  styleUrls: ['./advancedform.component.scss']
})

/**
 * Form advanced form
 */
export class AdvancedformComponent implements OnInit {

  /* #region Variables  */

  breadCrumbItems: Array<{}>;
  Date: string = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  typeAlertes: any[] = [];
  ListPriseEnCharge: any[] = [];
  Ports: any[] = [];
  newRow: any = {};
  Date_reception: string;
  beneficiaire: string;
  Courrier_recu: string
  Sujet: string;
  Ref_courrier: string;
  selectedType: string;
  Emetteur: string;
  Objectif: string;
  Remarque: string;
  nature: string;
  selectedPort: string;
  Emetteurs: any = [
    { id: 'Emetteur 1', name: 'Emetteur 1' },
    { id: 'Emetteur 2', name: 'Emetteur 2' },
    { id: 'Emetteur 3', name: 'Emetteur 3' },
    { id: 'Emetteur 4', name: 'Emetteur 4' }
  ];

  /* #endregion */

  /* #region Constructor */

  constructor(
    private ystanceService: YstanceService
  ) { }

  /* #endregion */

  /* #region init and Loading */

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Advanced', active: true }];
    this.GetPorts();
  }

  GetPorts() {
    let user: any = JSON.parse(sessionStorage.getItem('currentUser')!);
    let args = {
            thirdPartyEndPointName: 'GetPorts',
      thirdPartyEndpointQueryParams: '?page=1&perPage=1000'
    };
    this.ystanceService.apiHandler(YstanceEndPoints.thirdPartyEndPointHandler, args).subscribe(this.OnSuccessGetPorts);
  }

  /* #endregion */

  /* #region Events */

  AddnewRow() {
    this.newRow = {};
    this.ListPriseEnCharge.unshift(this.newRow);
  }

  SavePrisEnCharge() {
    let allParams = this.BuildInsertPrisEnCharge();
    this.ystanceService.apiHandler(YstanceEndPoints.insertItem, allParams).subscribe(this.OnSuccessInsertPrisEnCharge, YstanceHelper.onErrorResponse);

  }

  /* #endregion */

  /* #region Build Params */

  BuildInsertPrisEnCharge() {
    let user = JSON.parse(sessionStorage.getItem('currentUser')!);
    let entity = {
      date_creation: this.Date,
      emetteur: this.Emetteur,
      type: this.nature,
      beneficiaire: this.beneficiaire,
      region: this.selectedPort,
      ref_courrier: this.Ref_courrier,
      sujet: this.Sujet,
      date_reception: this.Date_reception,
      courrier_recu: this.Courrier_recu
    };
    let args = {
            entityChanges: entity,
      entityName: 'prisencharge',
      databaseProvider: 'mongodb'
    }
    return args;
  }

  /* #endregion */

  /* #region Arrow Function */

  OnSuccessGetPorts = (data: any) => {
    this.Ports = data.ports
  }

  OnSuccessInsertPrisEnCharge = (data: any) => {
    YstanceHelper.notify('Ajouté avec succès', null, 'success', 1800, null);
  }

  /* #endregion */

}
