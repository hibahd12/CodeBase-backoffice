import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WizardComponent } from 'angular-archwizard';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { SessionManager } from 'src/app/2_Services/SessionManager';
import { YstanceService } from 'src/app/2_Services/YstanceService';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'FrmAlertEnvironnement',
  templateUrl: './FrmAlertEnvironnement.component.html',
  styleUrls: ['./FrmAlertEnvironnement.component.scss']
})
export class FrmAlertEnvironnementComponent implements OnInit {

  /* #region Variables */

  @ViewChild(WizardComponent) wizard: WizardComponent;
  @Input() dateAlerte: Date;
  @Input() nature: string;
  @Input() category: any;
  @Input() emetteur: any;
  @Input() idCategory: string;
  alertSecondWizardBuilder: FormGroup;
  alertFirstWizardBuilder: FormGroup;
  selectedImages: File[] = [];
  principalSelectedImage: File;
  typeOptions = [
    { label: 'Distance', value: 'distance' },
    { label: 'In situ', value: 'In situ' }
  ];
  listEspeces: any[] = [
    { specie: '', mesure: '', nombre: '' }
  ];
  newRow: any = {};
  ports: any[] = [];
  categories: any[] = [];
  allDonor: any[] = [];
  allPresents: any[] = [];
  allIntervenants: any[] = [];
  allSpecies: any[] = [];
  environment = environment;


  /* #endregion */

  /* #region Constructor  */

  constructor(
    private ystanceService: YstanceService,
    public formBuilder: FormBuilder,
    public http: HttpClient,
    public sessionManager: SessionManager,
  ) { }

  /* #endregion */

  /* #region Init & Loading */

  ngOnInit() {
    this.alertFirstWizardBuilder = this.formBuilder.group({
      donor: ['', Validators.required],
      datedecouverte: ['', Validators.required],
      selectedPort: ['', Validators.required],
      present: ['', Validators.required],
      intervenant: ['', Validators.required],
      type_intervention: ['', Validators.required],
      nord: ['', Validators.required],
      sud: ['', Validators.required],
    });
    this.alertSecondWizardBuilder = this.formBuilder.group({
      sexe: ['', Validators.required],
      observation_environments: ['']
    });
    this.getAllDonor();
    this.getAllPresent();
    this.getAllIntervenant();
    this.getPorts();
  }

  getAllDonor() {
    let allParams = this.buildGetAllDonor();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessAllDonor, YstanceHelper.onErrorResponse);
  }

  getAllPresent() {
    let allParams = this.buildGetAllPresent();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessAllPresent, YstanceHelper.onErrorResponse);
  }

  getAllIntervenant() {
    let allParams = this.buildGetAllIntervenant();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessAllIntervenant, YstanceHelper.onErrorResponse);
  }

  getAllSpecies() {
    let allParams = this.buildGetAllSpecies();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessGetAllSpecies, YstanceHelper.onErrorResponse);
  }

  getPorts() {
    let allParams = this.buildGetAllLieuxAlert();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessGetAllPorts, YstanceHelper.onErrorResponse);
  }

  /* #endregion */

  /* #region Events */

  saveAlertEnvironment() {
    if (this.alertFirstWizardBuilder.valid && this.alertSecondWizardBuilder.valid) {
      if (this.selectedImages.length === 0) {
        Swal.fire({
          icon: 'error', title: 'Oops...', text: 'Veuillez remplir le champ image!'
        });
        return;
      }
      let allParams = this.buildInsertAlertEnvironment();
      this.ystanceService.apiHandler(YstanceEndPoints.insertItem, allParams).subscribe(this.onSuccessSaveAlert, YstanceHelper.onErrorResponse);
    }
    else {
      YstanceHelper.notify('Veuillez remplir tous les champs obligatoires.', null, 'error', 1800, null);
    }
  }

  addnewRow() {
    this.newRow = {};
    this.listEspeces.push(this.newRow);
  }

  cancelRow(index: number) {
    this.listEspeces.splice(index, 1);
  }

  onAddItemSpecie(event: any) {
    let newEntity = {
      title: event.NameItem,
      idcategory: this.category._id
    };
    event.OhmComponent.insertNewItem(newEntity);
  }

  onAddItemIntervenant(event: any) {
    let newEntity = {
      title: event.NameItem,
      idcategory: this.category._id
    };
    event.OhmComponent.insertNewItem(newEntity);
  }

  onAddItemPresent(event: any) {
    let newEntity = {
      title: event.NameItem,
      idcategory: this.category._id
    };
    event.OhmComponent.insertNewItem(newEntity);
  }

  onAddItemLieux(event: any) {
    let newEntity = {
      title: event.NameItem,
      idcategory: this.category._id
    };
    event.OhmComponent.insertNewItem(newEntity);
  }

  onAddItemDonnor(event: any) {
    let newEntity = {
      title: event.NameItem,
      idcategory: this.category._id
    };
    event.OhmComponent.insertNewItem(newEntity);
  }

  onImagesSelected(event: any) {
    const files: FileList = event.target.files;
    this.selectedImages = [];
    for (let i = 0; i < Math.min(files.length, 3); i++) {
      this.selectedImages.push(files[i]);
    }
  }

  onPrincipaleImageSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.principalSelectedImage = files[0];
    }
  }

  uploadImages(idAlert: string, isPrincipale: boolean, SelectedImage: any) {
    const formData = new FormData();
    const token = this.sessionManager.getToken();
    const requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    let entityMetaDatas = {
      idAlert: idAlert,
      isPrincipale: isPrincipale
    };
    formData.append('file', SelectedImage);
    formData.append('jsonEntityMetaDatas', JSON.stringify(entityMetaDatas));
    formData.append('entityName', 'imagespecie');
    this.http.post(environment.apiUrl + YstanceEndPoints.insertFile, formData, requestOptions)
      .subscribe(this.onSuccessUploadImage)
  }

  uploadPrincipalImage(idAlert: string) {
    this.uploadImages(idAlert, true, this.principalSelectedImage);
  }

  uploadMultipleImages(idAlert: string) {
    this.selectedImages.forEach((image: File) => {
      this.uploadImages(idAlert, false, image);
    });
  }

  nextStep() {
    // if (this.alertFirstWizardBuilder.valid) {
    this.wizard.goToNextStep();
    // } else {
    //   Swal.fire('Please fill in all required fields before proceeding.');
    // }
  }

  /* #endregion */

  /* #region Build Params */

  buildAlertEntity() {
    return {
      id: YstanceHelper.newGuid(),
      date_alert: this.dateAlerte,
      category: this.category,
      nature: this.nature,
      emetteur: this.emetteur,
      donor: this.alertFirstWizardBuilder.value.donor,
      datedecouverte: this.alertFirstWizardBuilder.value.datedecouverte,
      selectedPort: this.alertFirstWizardBuilder.value.selectedPort,
      present: this.alertFirstWizardBuilder.value.present,
      intervenant: this.alertFirstWizardBuilder.value.intervenant,
      nord: this.alertFirstWizardBuilder.value.nord,
      sud: this.alertFirstWizardBuilder.value.sud,
      type_intervention: this.alertFirstWizardBuilder.value.type_intervention,
      sexe: this.alertSecondWizardBuilder.value.sexe,
      observation: this.alertSecondWizardBuilder.value.observation_environments,
      listEspeces: this.listEspeces
    };
  }

  buildAlertArgs(entity: any) {
    return {
      entityChanges: entity,
      entityName: environment.entityNameAlerteEnvironment,
      databaseProvider: 'mongodb',
    };
  }

  buildInsertAlertEnvironment() {
    const entity = this.buildAlertEntity.call(this);
    const args = this.buildAlertArgs(entity);
    return args;
  }

  buildGetAllDonor() {
    let args = {
      filters: [],
      entityName: environment.entityNameDonneurAlerte,
      databaseProvider: "mongodb"
    }
    return args;
  }

  buildGetAllPresent() {
    let args = {
      filters: [],
      entityName: environment.entityNamePresentAlerte,
      databaseProvider: "mongodb"
    }
    return args;
  }

  buildGetAllIntervenant() {
    let args = {
      filters: [],
      entityName: environment.entityNameIntervenantAlerte,
      databaseProvider: "mongodb"
    }
    return args;
  }

  buildGetAllSpecies() {
    let args = {
      filters: [
        { property: 'idcategory', value: this.idCategory }
      ],
      entityName: environment.entityNameSpecieAlerte,
      databaseProvider: "mongodb"
    }
    return args;
  }

  buildGetAllLieuxAlert() {
    let args = {
      filters: [],
      entityName: environment.entityNameLieuxAlerte,
      databaseProvider: "mongodb"
    }
    return args;
  }

  /* #endregion */

  /* #region Arrow functions  */

  onSuccessGetPorts = (data: any) => {
    this.ports = data.ports
  }

  onSuccessAllDonor = (data: any) => {
    this.allDonor = data
  }

  onSuccessAllPresent = (data: any) => {
    this.allPresents = data
  }

  onSuccessAllIntervenant = (data: any) => {
    this.allIntervenants = data
  }

  onSuccessGetAllSpecies = (data: any) => {
    this.allSpecies = data
  }

  onSuccessGetAllPorts = (data: any) => {
    this.ports = data
  }

  onSuccessUploadImage = (event: any) => {
  }

  onSuccessUploadImagePrincipale = (event: any) => { }

  onSuccessSaveAlert = (data: any) => {
    this.uploadPrincipalImage(data.id);
    this.uploadMultipleImages(data.id);
    YstanceHelper.notify('Ajouté avec succès', null, 'success', 1800, null);
  }

  /* #endregion */

}
