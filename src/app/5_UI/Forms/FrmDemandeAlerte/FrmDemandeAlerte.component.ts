import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { YstanceService } from 'src/app/2_Services/YstanceService';
import { environment } from 'src/environments/environment';
import { FrmAlertEnvironnementComponent } from '../FrmAlertEnvironnement/FrmAlertEnvironnement.component';

@Component({
  selector: 'Sys_FrmDemandeAlerte',
  templateUrl: './FrmDemandeAlerte.component.html',
  styleUrls: ['./FrmDemandeAlerte.component.scss']
})
export class FrmDemandeAlerteComponent implements OnInit {

  /* #region Variables */

  @ViewChild(FrmAlertEnvironnementComponent) environementAlertFrmComponent: FrmAlertEnvironnementComponent;
  demandeAlertBuilder: FormGroup;
  environment = environment;
  typeAlertes: any[] = [];
  categories: any[] = [];
  sousCategories: any[] = [];
  listAllEmetteurs: any = [];
  emetteur: any;
  idtype: string;
  category: any
  selectedEmetteurs: any;
  selectedCategory: string;

  /* #endregion */

  /* #region Constructor  */

  constructor(
    private router: Router,
    private ystanceService: YstanceService,
    public formBuilder: FormBuilder,
    public http: HttpClient,
    private route: ActivatedRoute,
  ) { }

  /* #endregion */

  /* #region Init & Loading */

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idtype = params['id'];
    });
    this.demandeAlertBuilder = this.formBuilder.group({
      statutAlerte: ['', Validators.required],
      dateAlerte: [new Date().toISOString().substring(0, 10), Validators.required],
      category: ['', Validators.required],
      // sousCategorie: ['', Validators.required],
      type: ['', Validators.required],
      nature: ['', Validators.required],
      emetteur: ['', Validators.required],
      statut: ['', Validators.required],
    });
    this.getCategory();
    this.getAllEmetteurs();
  }

  getCategory() {
    let allParams = this.buildGetCategory();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessGetCategory, YstanceHelper.onErrorResponse);
  }

  getSousCategory() {
    let allParams = this.buildArgsSousCategory();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessSousGetCategory, YstanceHelper.onErrorResponse);
  }

  getAllEmetteurs() {
    let allParams = this.buildGetAllEmetteurs();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessGetAllEmetteurs, YstanceHelper.onErrorResponse);
  }

  /* #endregion */

  /* #region Events */

  onCategoryChange(event: any) {
    this.category = event
    this.getSousCategory();
    if (this.idtype == environment.idTypeEnvironnement) {
      this.environementAlertFrmComponent.idCategory = event?._id;
      this.environementAlertFrmComponent.getAllSpecies.bind(this.environementAlertFrmComponent)()
    }
  }

  onAddSousCategory(event: any) {
    if (!this.category.sousCategories) {
      this.category.sousCategories = [];
    }
    this.category.sousCategories.push(event.NameItem);
    event.OhmComponent.updateItem(this.category);
  }

  onEmitteurChange(event: any) {
    this.emetteur = event.map((element: any) => element.title);
  }

  onAddItem(event: any) {
    let newEntity = {
      title: event.NameItem,
      idtype: this.idtype
    };
    event.OhmComponent.insertNewItem(newEntity);
  }

  addNewAlert(): void {
    this.router.navigate(['/form/layouts']);
  }

  /* #endregion */

  /* #region Build Params */

  buildGetCategory() {
    let args = {
      filters: [
        { property: 'idtype', value: this.idtype }
      ],
      entityName: environment.entityNameCategoryAlerte,
      databaseProvider: "mongodb"
    };
    return args;
  }

  buildArgsSousCategory() {
    let args = {
      filters: [
        { property: 'idtype', value: this.idtype },
        { property: 'id', value: environment.idCategoryBiotoxine }
      ],
      entityName: environment.entityNameCategoryAlerte,
      databaseProvider: "mongodb"
    };
    return args;
  }

  buildGetAllEmetteurs() {
    let args = {
      filters: [
        { property: 'idtype', value: this.idtype }
      ],
      entityName: environment.entityNameEmetteurAlerte,
      databaseProvider: "mongodb"
    }
    return args;
  }

  /* #endregion */

  /* #region Arrow functions  */

  onSuccessGetAllEmetteurs = (data: any) => {
    this.listAllEmetteurs = data;
  }

  onSuccessGetTypeAlert = (data: any) => {
    this.typeAlertes = data
  }

  onSuccessGetCategory = (data: any) => {    
    this.categories = data;
  }

  onSuccessSousGetCategory = (data: any) => {
    this.sousCategories = data[0].sousCategories;
  }

  /* #endregion */

}