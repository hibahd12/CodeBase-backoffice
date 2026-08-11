import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { SessionManager } from 'src/app/2_Services/SessionManager';
import { YstanceService } from 'src/app/2_Services/YstanceService';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'FrmAlertSanitaire',
  templateUrl: './FrmAlertSanitaire.component.html',
  styleUrls: ['./FrmAlertSanitaire.component.scss']
})
export class FrmAlertSanitaireComponent implements OnInit {

  /* #region Variables */

  demandeAlertSanitaireBuilder: FormGroup;
  selectedImages: File[] = [];
  principalSelectedImage: File;
  @Input() dateAlerte: Date;
  @Input() statutAlerte: string;
  @Input() nature: string;
  @Input() category: any;
  @Input() emetteur: any;
  environment = environment;
  species: any[] = [];
  ports: any[] = [];


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
    this.demandeAlertSanitaireBuilder = this.formBuilder.group({
      specie: ['', Validators.required],
      port: ['', Validators.required],
      datePrelevement: ['', ],
      dateCommuniquePresse: ['', ],
      dateLeveeAlerte: ['', ],
      observation: [''],
    });
    this.getSpecies();
    this.getPorts();
  }

  getSpecies() {
    let args = {
      entityName: environment.entityNameEspecesAlerteSanitaire,
      databaseProvider: "mongodb",
      filters: [],
    }
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, args).subscribe(this.onSuccessGetSpecies);
  }

  getPorts() {
    let args = {
      entityName: environment.entityNamePortsAlerteSanitaire,
      databaseProvider: "mongodb",
      filters: [],
    }
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, args).subscribe(this.onSuccessGetPorts);
  }

  /* #endregion */

  /* #region Events */

  saveAlertSanitaire() {
    if (this.demandeAlertSanitaireBuilder.valid) {
      // if (this.selectedImages.length === 0) {
      //   Swal.fire({
      //     icon: 'error', title: 'Oops...', text: 'Veuillez remplir le champ image!'
      //   });
      //   return;
      // }
    let allParams = this.buildInsertAlertSanitaire();
    this.ystanceService.apiHandler(YstanceEndPoints.insertItem, allParams).subscribe(this.onSuccessSaveAlert, YstanceHelper.onErrorResponse);
    } else {
      YstanceHelper.notify('Veuillez remplir tous les champs obligatoires.', null, 'error', 1800, null);
    }
  }

  onAddItem(event: any) {
    let newEntity = {
      title: event.NameItem,
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

  /* #endregion */

  /* #region Build Params */

  buildInsertAlertSanitaire() {
    let entity = {
      id: YstanceHelper.newGuid(),
      statut_alert: this.statutAlerte,
      date_alert: this.dateAlerte,
      category: this.category,
      nature: this.nature,
      emetteur: this.emetteur,
      specie: this.demandeAlertSanitaireBuilder.value.specie,
      port: this.demandeAlertSanitaireBuilder.value.port,
      observation: this.demandeAlertSanitaireBuilder.value.observation,
      datePrelevement: this.demandeAlertSanitaireBuilder.value.datePrelevement,
      dateCommuniquePresse: this.demandeAlertSanitaireBuilder.value.dateCommuniquePresse,
      dateLeveeAlerte: this.demandeAlertSanitaireBuilder.value.dateLeveeAlerte,
    };
    let args = {
      entityChanges: entity,
      entityName: environment.entityNameAlerteSanitaire,
      databaseProvider: 'mongodb'
    }
    return args;
  }

  /* #endregion */

  /* #region Arrow functions  */

  onSuccessGetSpecies = (data: any) => {    
    this.species = data
  }

  onSuccessGetPorts = (data: any) => {
    this.ports = data
  }

  onSuccessSaveAlert = (data: any) => {
    this.uploadPrincipalImage(data.id);
    this.uploadMultipleImages(data.id);
    YstanceHelper.notify('Ajouté avec succès', null, 'success', 1800, null);
  }

  onSuccessUploadImage = (event: any) => {
  }

  /* #endregion */

}