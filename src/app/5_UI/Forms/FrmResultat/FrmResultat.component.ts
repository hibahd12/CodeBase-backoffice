import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { SessionManager } from 'src/app/2_Services/SessionManager';
import { YstanceService } from 'src/app/2_Services/YstanceService';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'Sys_FrmResultat',
  templateUrl: './FrmResultat.component.html',
  styleUrls: ['./FrmResultat.component.scss']
})

export class FrmResultatComponent implements OnInit {

  /* #region Variables */

  resultatBuilder: FormGroup;
  priseEncharge: any;
  priseEnchargeId: string;
  ResponseAvis: File;

  /* #endregion */

  /* #region Constructor */

  constructor(
    private ystanceService: YstanceService,
    private route: ActivatedRoute,
    public router: Router,
    public formBuilder: FormBuilder,
    public http: HttpClient,
    public sessionManager: SessionManager,
  ) { }

  /* #endregion */

  /* #region Init and Loading */

  ngOnInit(): void {
    this.resultatBuilder = this.formBuilder.group({
      referenceAvis: ['', Validators.required],
      dateReponseAvis: [new Date().toISOString().substring(0, 10), Validators.required],
      observation: ['', Validators.required],
    });
    this.route.params.subscribe(params => {
      this.priseEnchargeId = params['id'];
    });
    this.getPriseEncharge()
  }

  getPriseEncharge() {
    let allParams = this.buildGetPrisEnCharge();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemByPrimaryKey, allParams).subscribe(this.onSuccessGetPriseEncharge, YstanceHelper.onErrorResponse);
  }

  getResultat() {
    let allParams = this.buildGetResultat();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemByPrimaryKey, allParams).subscribe(this.onSuccessGetResultat, YstanceHelper.onErrorResponse);

  }

  /* #endregion */

  /* #region Events */

  private scrollToFirstError() {
    setTimeout(() => {
      const firstError = document.querySelector('.ng-invalid, .is-invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  saveResultat() {
    if (!this.resultatBuilder.valid) {
      this.resultatBuilder.markAllAsTouched();
      this.scrollToFirstError();
      return;
    }
    let allParams = this.buildResultat();
    this.ystanceService.apiHandler(YstanceEndPoints.updateItemByPrimaryKey, allParams).subscribe(this.onSuccessInsertResultat, YstanceHelper.onErrorResponse);
  }

  onResponseAvisSelected(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.ResponseAvis = files[0];
    }
  }

  uploadResponse(idAvisScientific: string) {
    const formData = new FormData();
    let entityMetaDatas = {
      idAvisScientific: idAvisScientific,
    };
    formData.append('file', this.ResponseAvis);
    formData.append('jsonEntityMetaDatas', JSON.stringify(entityMetaDatas));
    formData.append('entityName', environment.entityNameAvisreponsescientific);
    var token = this.sessionManager.getToken();
    let requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    }
    this.http.post(environment.apiUrl + YstanceEndPoints.insertFile, formData, requestOptions).subscribe(this.onSuccessuploadResponse, YstanceHelper.onErrorResponse);

  }

  /* #endregion */

  /* #region Build Params */

  buildGetPrisEnCharge() {
    let args = {
      primaryKeyName: '_id',
      primaryKeyValue: this.priseEnchargeId,
      entityName: environment.entityNameAvisScientifique,
      databaseProvider: "mongodb"
    }
    return args;
  }

  buildGetResultat() {
    let args = {
      primaryKeyName: '_id',
      primaryKeyValue: this.priseEnchargeId,
      entityName: environment.entityNameAvisScientifique,
      databaseProvider: "mongodb"
    }
    return args;
  }

  buildResultat() {
    let user = JSON.parse(sessionStorage.getItem('currentUser')!);
    this.priseEncharge['refAvis'] = this.resultatBuilder.value.referenceAvis
    this.priseEncharge['dateReponseAvis'] = this.resultatBuilder.value.dateReponseAvis
    this.priseEncharge['uploadReponseAvis'] = this.resultatBuilder.value.UploadReponseAvis
    this.priseEncharge['observation'] = this.resultatBuilder.value.observation
    this.priseEncharge['statut'] = "statut3"
    let args = {
      entityChanges: this.priseEncharge,
      entityName: environment.entityNameAvisScientifique,
      databaseProvider: 'mongodb',
      primaryKeyName: '_id',
      primaryKeyValue: this.priseEncharge._id
    }
    return args;
  }

  /* #endregion */

  /* #region Arrow Function */

  onSuccessGetPriseEncharge = (data: any) => {
    this.priseEncharge = data;
    if (data.refAvis) {
      this.resultatBuilder.patchValue({ referenceAvis: data.refAvis });
    }
    if (data.dateReponseAvis) {
      this.resultatBuilder.patchValue({ dateReponseAvis: data.dateReponseAvis });
    }
    if (data.observation) {
      this.resultatBuilder.patchValue({ observation: data.observation });
    }
  }

  onSuccessInsertResultat = (data: any) => {
    if (this.ResponseAvis) {
      this.uploadResponse(data.id);
    } else {
      YstanceHelper.notify('Ajouté avec succès', null, 'success', 1800, null);
      this.router.navigate(['Sys_FrmAvisScientific', this.priseEnchargeId]);
    }
  }

  onSuccessGetResultat = (data: any) => {
  }

  onSuccessuploadResponse = (event: any) => {
    YstanceHelper.notify('Résultat enregistré avec succès', null, 'success', 1800, null);
    this.router.navigate(['Sys_FrmAvisScientific', this.priseEnchargeId]);
  }

  /* #endregion */

}