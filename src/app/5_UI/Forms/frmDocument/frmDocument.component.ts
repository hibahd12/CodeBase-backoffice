import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { SessionManager } from 'src/app/2_Services/SessionManager';
import { YstanceService } from 'src/app/2_Services/YstanceService';
import { OhmForm } from 'src/app/3_Super/OhmForm';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'Sys_FrmDocument',
  templateUrl: './frmDocument.component.html',
  styleUrls: ['./frmDocument.component.scss']
})
export class FrmDocumentComponent extends OhmForm {

  /* #region Variables */

  file: any;
  record: any = {};

  /* #endregion */

  /* #region init & loading  */

  override initialisationParametres() {
    this.entityName = environment.entityNameDocumentUtile;
  }

  override initializeFormBuilder(entity: any): void {
    this.form = this.formBuilder.group({});
    if (this.formLoaded == false) {
      this.form = this.formBuilder.group({
        'titre': new FormControl('', Validators.required),
        'document': new FormControl(null, Validators.required),
        'date': new FormControl(new Date().toISOString().substring(0, 10), Validators.required),
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

  /* #endregion */

  /* #region constructor */

  constructor(private httpClient: HttpClient, ystanceService: YstanceService, router: Router, http: HttpClient, route: ActivatedRoute, sessionManager: SessionManager, formBuilder: FormBuilder) {
    super(ystanceService, router, http, route, sessionManager, formBuilder);
  }

  /* #endregion */

  /* #region events */

  buildParams() {
    let args = {
      entityChanges: this.record,
      entityName: environment.entityNameDocumentUtile,
      databaseProvider: 'mongodb',
    }
    return args;
  }

  onDocumentSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.form.get('document')?.setValue(this.file.name);
    }
  }

  saveRecord() {
    if (this.form.valid) {
      this.record.id = this.newGuid();
      this.record.titre = this.form.controls['titre'].value;
      this.record.document = this.form.controls['document'].value;
      this.record.date = new Date().toISOString().substring(0, 10);
      this.insertRecord(this.record);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires.',
        confirmButtonText: 'OK'
      });
    }
  }

  insertRecord(record: any) {
    let allParams = this.buildParams();
    this.ystanceService.apiHandler(YstanceEndPoints.insertItem, allParams).subscribe(this.onSuccessInsertRecord, YstanceHelper.onErrorResponse);
  }

  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  insertFile(file: any) {
    const formData = new FormData();
    let entityMetaDatas = {
      idparent: this.record.id,
      type: 'documentutile',
    };
    formData.append('file', file, file.name);
    formData.append('jsonEntityMetaDatas', JSON.stringify(entityMetaDatas));
    formData.append('entityName', 'attachement');
    var token = this.sessionManager.getToken();
    let requestOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + token
      })
    }
    this.httpClient.post(environment.apiUrl + YstanceEndPoints.insertFile, formData, requestOptions).subscribe(this.onSuccessuploadDocument);
  }

  /* #endregion */

  /* #region arrow functions */

  onSuccessInsertRecord = (response: any) => {
    if (this.file) {
      this.insertFile(this.file);
    }
  }

  onSuccessuploadDocument = (response: any) => {
    Swal.fire({
      title: 'Ajouté avec succès',
      icon: 'success',
      showConfirmButton: false,
      timer: 1500
    });
  }

  /* #endregion */
}
