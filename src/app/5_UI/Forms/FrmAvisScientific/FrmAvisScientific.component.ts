import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { YstanceService } from 'src/app/2_Services/YstanceService';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'Sys_FrmAvisScientific',
  templateUrl: './FrmAvisScientific.component.html',
  styleUrls: ['./FrmAvisScientific.component.scss']
})

export class FrmAvisScientificComponent implements OnInit {

  /* #region Variables */

  resultatBuilder: FormGroup;
  priseEncharge: any;
  priseEnchargeId: string;
  refAvis: string;
  dateReponseAvis: string;
  uploadReponseAvis: string;
  observation: string;
  courriers: any[] = [];
  responseFiles: any[] = [];

  /* #endregion */

  /* #region Constructor */

  constructor(
    private ystanceService: YstanceService,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
  ) { }

  /* #endregion */

  /* #region Init and Loading */

  ngOnInit(): void {
    this.resultatBuilder = this.formBuilder.group({
      referenceAvis: ['', Validators.required],
      dateReponseAvis: [new Date().toISOString().substring(0, 10), Validators.required],
      UploadReponseAvis: ['', Validators.required],
      observation: ['', Validators.required],
    });
    this.route.params.subscribe(params => {
      this.priseEnchargeId = params['id'];
    });
    this.getResultat();
  }

  getResultat() {
    let allParams = this.buildGetResultat();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemByPrimaryKey, allParams).subscribe(this.onSuccessGetResultat, YstanceHelper.onErrorResponse);
  }

  loadCourriers() {
    let args = {
      filters: [{
        property: 'metadatas.idAvisScientific',
        value: this.priseEncharge.id,
      }],
      entityName: environment.entityNameCourrierscientific,
      databaseProvider: "mongodb"
    };
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, args).subscribe(this.onSuccessLoadCourriers, YstanceHelper.onErrorResponse);
  }

  loadResponseFiles() {
    let args = {
      filters: [{
        property: 'metadatas.idAvisScientific',
        value: this.priseEncharge.id,
      }],
      entityName: environment.entityNameAvisreponsescientific,
      databaseProvider: "mongodb"
    };
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, args).subscribe(this.onSuccessLoadResponseFiles, YstanceHelper.onErrorResponse);
  }

  /* #endregion */

  /* #region Events */

  private detectMimeType(content: string): string {
    const header = content.substring(0, 10);
    if (header.startsWith('iVBOR')) return 'image/png';
    if (header.startsWith('JVBER')) return 'application/pdf';
    if (header.startsWith('/9j/')) return 'image/jpeg';
    return 'application/octet-stream';
  }

  private contentToBlob(content: string, mimeType: string): Blob {
    const byteCharacters = atob(content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
  }

  viewFile(file: any) {
    if (!file.content) return;
    const mimeType = this.detectMimeType(file.content);
    const blob = this.contentToBlob(file.content, mimeType);
    const url = window.URL.createObjectURL(blob);
    if (mimeType === 'application/pdf' || mimeType.startsWith('image/')) {
      window.open(url, '_blank');
    } else {
      this.downloadFile(file);
    }
  }

  downloadFile(file: any) {
    if (!file.content) return;
    const mimeType = this.detectMimeType(file.content);
    const blob = this.contentToBlob(file.content, mimeType);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (file.metadatas?.name || 'fichier') + this.getExtension(mimeType);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  confirmDeleteFile(file: any, type: 'courrier' | 'response') {
    const fileName = file.metadatas?.name || 'ce fichier';
    Swal.fire({
      title: 'Confirmer la suppression',
      html: `Pour supprimer le courrier <strong>${fileName}</strong>, tapez le mot <strong>SUPPRIMER</strong> ci-dessous :`,
      input: 'text',
      inputPlaceholder: 'Tapez SUPPRIMER',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33',
      preConfirm: (inputValue) => {
        if (inputValue !== 'SUPPRIMER') {
          Swal.showValidationMessage('Vous devez taper exactement SUPPRIMER');
          return false;
        }
        return true;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const entityName = type === 'courrier'
          ? environment.entityNameCourrierscientific
          : environment.entityNameAvisreponsescientific;
        let args = {
          entity: file,
          entityName: entityName,
          databaseProvider: 'mongodb',
          primaryKeyName: '_id',
          primaryKeyValue: file._id
        };
        this.ystanceService.apiHandler(YstanceEndPoints.deleteItem, args).subscribe({
          next: () => {
            if (type === 'courrier') {
              this.courriers = this.courriers.filter(c => c._id !== file._id);
            } else {
              this.responseFiles = this.responseFiles.filter(r => r._id !== file._id);
            }
            YstanceHelper.notify('Fichier supprimé', null, 'success', 1800, null);
          },
          error: YstanceHelper.onErrorResponse
        });
      }
    });
  }

  getExtension(mimeType: string): string {
    if (mimeType === 'image/png') return '.png';
    if (mimeType === 'application/pdf') return '.pdf';
    if (mimeType === 'image/jpeg') return '.jpg';
    return '';
  }

  formatRegion(region: any): string {
    if (!region) {
      return '';
    }
    return Array.isArray(region) ? region.join(', ') : region;
  }

  /* #endregion */

  /* #region Build Params */

  buildGetResultat() {
    let args = {
      primaryKeyName: '_id',
      primaryKeyValue: this.priseEnchargeId,
      entityName: environment.entityNameAvisScientifique,
      databaseProvider: "mongodb"
    }
    return args;
  }

  /* #endregion */

  /* #region Arrow Function */

  onSuccessInsertResultat = (data: any) => {
    YstanceHelper.notify('Ajouté avec succès', null, 'success', 1800, null);
  }

  onSuccessGetResultat = (data: any) => {
    this.priseEncharge = data;
    this.loadCourriers();
    this.loadResponseFiles();
  }

  onSuccessLoadCourriers = (data: any) => {
    if (this.priseEncharge?.id) {
      this.courriers = data.filter((f: any) => f.metadatas?.idAvisScientific === this.priseEncharge.id);
    }
  }

  onSuccessLoadResponseFiles = (data: any) => {
    if (this.priseEncharge?.id) {
      this.responseFiles = data.filter((f: any) => f.metadatas?.idAvisScientific === this.priseEncharge.id);
    }
  }

  /* #endregion */

}
