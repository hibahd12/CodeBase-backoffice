import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { SessionManager } from 'src/app/2_Services/SessionManager';
import { YstanceService } from 'src/app/2_Services/YstanceService';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'Sys_FrmPriseEnCharge',
  templateUrl: './FrmPriseEnCharge.component.html',
  styleUrls: ['./FrmPriseEnCharge.component.scss']
})

export class FrmPriseEnChargeComponent implements OnInit {

  /* #region Variables  */

  avisScientifiqueFormBuilder: FormGroup;
  listOfCourriers: any[] = [];
  emetteurs: any[] = [];
  selectedCourrierRecu: File;
  ports: any[] = [];
  regionStaticOptions: any[] = [
    { title: 'Méditerranée' },
    { title: 'Est Méditerranée' },
    { title: 'Ouest Méditerranée' },
    { title: 'Atlantique' },
    { title: 'Atlantique Nord' },
    { title: 'Atlantique Centre' },
    { title: 'Atlantique Sud' },
  ];
  environment = environment;
  newRow: any = {};
  emetteur: string;
  emetteurError: boolean = false;

  /* #endregion */

  /* #region Constructor */

  constructor(
    private ystanceService: YstanceService,
    public formBuilder: FormBuilder,
    public http: HttpClient,
    public sessionManager: SessionManager,
    private router: Router,
  ) { }

  /* #endregion */

  /* #region init and Loading */

  ngOnInit() {
    this.avisScientifiqueFormBuilder = this.formBuilder.group({
      date: [new Date().toISOString().substring(0, 10), Validators.required],
      beneficiaire: ['', Validators.required],
      region: [[], Validators.required],
      nature: ['', Validators.required],
      sujet: ['', Validators.required],
    });
    this.getAllEmetteurs();
    this.getPorts();
    this.addNewCourrierRow();
  }

  getPorts() {
    let args = {
      filters: [],
      entityName: environment.entityNamePortsAlerteSanitaire,
      databaseProvider: "mongodb"
    };
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, args).subscribe(this.onSuccessGetPorts, YstanceHelper.onErrorResponse);
  }

  getAllEmetteurs() {
    let allParams = this.buildAllEmetteurs();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessAllEmetteurs, YstanceHelper.onErrorResponse);
  }

  /* #endregion */

  /* #region Events */

  addNewCourrierRow() {
    this.listOfCourriers.push({ refCourrier: '', dateReception: '', courrierRecu: null });
  }

  cancelRow(index: number) {
    this.listOfCourriers.splice(index, 1);
  }

  private scrollToFirstError() {
    setTimeout(() => {
      const firstError = document.querySelector('.ng-invalid, .is-invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  savePrisEnCharge() {
    this.emetteurError = !this.emetteur || this.emetteur.length === 0;
    if (!this.avisScientifiqueFormBuilder.valid || this.emetteurError) {
      this.avisScientifiqueFormBuilder.markAllAsTouched();
      this.scrollToFirstError();
      return;
    }
    const hasInvalidCourrier = this.listOfCourriers.some(c => !c.refCourrier || !c.dateReception || !c.courrierRecu);
    if (hasInvalidCourrier) {
      YstanceHelper.notify('Veuillez remplir tous les champs courrier et sélectionner un fichier', null, 'warning', 2500, null);
      return;
    }
    let allParams = this.buildInsertPrisEnCharge();
    this.ystanceService.apiHandler(YstanceEndPoints.insertItem, allParams)
      .subscribe({ next: this.onSuccessInsertPrisEnCharge, error: YstanceHelper.onErrorResponse });
  }

  onAddItem(event: any) {
    let newEntity = {
      title: event.NameItem,
    };
    event.OhmComponent.insertNewItem(newEntity);
  }

  onChangeEmetteur(event: any) {
    this.emetteur = event.title;
    this.emetteurError = false;
  }

  onCourrierSelected(event: any, courrier: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.listOfCourriers[courrier].courrierRecu = files[0];
    }
  }

  uploadCourriers(idAvisScientific: string) {
    var token = this.sessionManager.getToken();
    let requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    };
    const uploads = this.listOfCourriers
      .filter(courrier => courrier.courrierRecu)
      .map(courrier => {
        const formData = new FormData();
        let entityMetaDatas = {
          idAvisScientific: idAvisScientific,
          name: courrier.refCourrier,
          dateReception: courrier.dateReception,
        };
        formData.append('file', courrier.courrierRecu, courrier.courrierRecu.name);
        formData.append('jsonEntityMetaDatas', JSON.stringify(entityMetaDatas));
        formData.append('entityName', environment.entityNameCourrierscientific);
        return this.http.post(environment.apiUrl + YstanceEndPoints.insertFile, formData, requestOptions);
      });
    if (uploads.length > 0) {
      forkJoin(uploads).subscribe({
        next: () => {
          YstanceHelper.notify('Courriers uploadés avec succès', null, 'success', 1800, null);
          this.router.navigate(['AvisScientifiques']);
        },
        error: (err) => {
          YstanceHelper.notify('Erreur lors de l\'upload des courriers', null, 'error', 2500, null);
        }
      });
    } else {
      this.router.navigate(['AvisScientifiques']);
    }
  }

  /* #endregion */

  /* #region Build Params */

  buildInsertPrisEnCharge() {
    let courriersForApi = this.listOfCourriers.map(c => ({
      refCourrier: c.refCourrier,
      dateReception: c.dateReception,
    }));
    let entity = {
      id: YstanceHelper.newGuid(),
      dateCreation: this.avisScientifiqueFormBuilder.value.date,
      emetteur: this.emetteur,
      sujet: this.avisScientifiqueFormBuilder.value.sujet,
      beneficiaire: this.avisScientifiqueFormBuilder.value.beneficiaire,
      region: this.avisScientifiqueFormBuilder.value.region,
      nature: this.avisScientifiqueFormBuilder.value.nature,
      statut: "statut1",
      listOfCourrier: courriersForApi
    };
    let args = {
      entityChanges: entity,
      entityName: environment.entityNameAvisScientifique,
      databaseProvider: 'mongodb'
    }
    return args;
  }

  buildAllEmetteurs() {
    let args = {
      filters: [],
      entityName: environment.entityNameEmetteurAvisScientifique,
      databaseProvider: "mongodb"
    }
    return args;
  }

  /* #endregion */

  /* #region Arrow Function */

  onSuccessGetPorts = (data: any) => {
    this.ports = this.regionStaticOptions;
  }

  onSuccessInsertPrisEnCharge = (data: any) => {
    YstanceHelper.notify('Ajouté avec succès', null, 'success', 1800, null);
    this.uploadCourriers(data.id);
  }

  onSuccessAllEmetteurs = (data: any) => {
    this.emetteurs = data
  }


  /* #endregion */

}
