import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { YstanceService } from 'src/app/2_Services/YstanceService';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'Sys_FrmTraitementAvis',
  templateUrl: './FrmTraitementAvis.component.html',
  styleUrls: ['./FrmTraitementAvis.component.scss']
})

export class FrmTraitementAvisComponent implements OnInit {

  /* #region Variables */

  environment = environment;
  traitementAvisBuilder: FormGroup;
  listAssignedTo: any = [];
  stepsOfProcessing: any = [];
  assignedToOptions = [
    { id: 'Najd', title: 'Najd' },
    { id: 'Directeur', title: 'Directeur' },
    { id: 'secrétaire Général', title: 'secrétaire Général' },
    { id: 'Département Pêche', title: 'Département Pêche' },
    { id: 'Département Surveillance et Suivi du Milieu Marin', title: 'Département Surveillance et Suivi du Milieu Marin' },
    { id: 'Département Aquaculture', title: 'Département Aquaculture' },
    { id: 'Département Océanographie', title: 'Département Océanographie' },
    { id: 'Département d\'Appui à la recherche', title: 'Département d\'Appui à la recherche' },
    { id: 'Lab. Biologie Ecologie/CR Casablanca', title: 'Lab. Biologie Ecologie/CR Casablanca' },
    { id: 'Cellule pêche/CR Casablanca', title: 'Cellule pêche/CR Casablanca' },
    { id: 'Lab. Evaluation des Ressources Littorales/CR Casablanca', title: 'Lab. Evaluation des Ressources Littorales/CR Casablanca' },
    { id: 'Lab. d’évaluation et de suivi des Pêcheries/CR Casablanca', title: 'Lab. d’évaluation et de suivi des Pêcheries/CR Casablanca' },
    { id: 'Lab. Pêche/CR Nador', title: 'Lab. Pêche/CR Nador' },
    { id: 'Lab. Pêche/CR Laayoune', title: 'Lab. Pêche/CR Laayoune' },
    { id: 'Lab. Pêche/CR Tanger', title: 'Lab. Pêche/CR Tanger' },
    { id: 'Lab. Pêche/CR Dakhla', title: 'Lab. Pêche/CR Dakhla' },
    { id: 'Lab. Pêche/CR Agadir', title: 'Lab. Pêche/CR Agadir' },
    { id: 'Lab. de Prospections Acoustiques/CR Agadir', title: 'Lab. de Prospections Acoustiques/CR Agadir' },
    { id: 'Lab.de Génétique des populations halieutiques/CR Agadir', title: 'Lab.de Génétique des populations halieutiques/CR Agadir' },
    { id: 'Lab. de Prospections Demersales/CR Agadir', title: 'Lab. de Prospections Demersales/CR Agadir' },
    { id: 'Lab. d’Economie des Pêches/CR Agadir', title: 'Lab. d’Economie des Pêches/CR Agadir' },
    { id: 'Lab. Surveillance et Suivi du Milieu Marin/CR Nador', title: 'Lab. Surveillance et Suivi du Milieu Marin/CR Nador' },
    { id: 'Lab. Surveillance et Suivi du Milieu Marin/CR Tanger', title: 'Lab. Surveillance et Suivi du Milieu Marin/CR Tanger' },
    { id: 'Lab. Surveillance et Suivi du Milieu Marin/CR Agadir', title: 'Lab. Surveillance et Suivi du Milieu Marin/CR Agadir' },
    { id: 'Lab. Surveillance et Suivi du Milieu Marin/CR Laayoune', title: 'Lab. Surveillance et Suivi du Milieu Marin/CR Laayoune' },
    { id: 'Lab. Surveillance et Suivi du Milieu Marin/CR Dakhla', title: 'Lab. Surveillance et Suivi du Milieu Marin/CR Dakhla' },
    { id: 'Station Surveillance et Suivi du Milieu Marin d\'Oualidia/CR Casablanca', title: 'Station Surveillance et Suivi du Milieu Marin d\'Oualidia/CR Casablanca' },
    { id: 'Lab. des Biotoxines Marines/CR Casablanca', title: 'Lab. des Biotoxines Marines/CR Casablanca' },
    { id: 'Lab. de Chimie/CR Casablanca', title: 'Lab. de Chimie/CR Casablanca' },
    { id: 'Lab. d’Ecotoxicologie/CR Casablanca', title: 'Lab. d’Ecotoxicologie/CR Casablanca' },
    { id: 'Lab. de phytoplancton et des Efflorescences Nuisibles/CR Casablanca', title: 'Lab. de phytoplancton et des Efflorescences Nuisibles/CR Casablanca' },
    { id: 'Lab. de Chimie/CR Tanger', title: 'Lab. de Chimie/CR Tanger' },
    { id: 'Lab. de Génie Alimentaire/CS Valorisation', title: 'Lab. de Génie Alimentaire/CS Valorisation' },
    { id: 'Lab. de Contrôle Qualité/CS Valorisation', title: 'Lab. de Contrôle Qualité/CS Valorisation' },
    { id: 'Lab. de Biotechnologie/CS Valorisation', title: 'Lab. de Biotechnologie/CS Valorisation' },
    { id: 'Lab. d’Ecologie du Plancton Marin/CR Casablanca', title: 'Lab. d’Ecologie du Plancton Marin/CR Casablanca' },
    { id: 'Lab. de Physique et Bio-géochimie Marine/CR Casablanca', title: 'Lab. de Physique et Bio-géochimie Marine/CR Casablanca' },
    { id: 'Lab. de Modélisation Océanographique et écosystémique/CR Tanger', title: 'Lab. de Modélisation Océanographique et écosystémique/CR Tanger' },
    { id: 'Laboratoire Histopathologie/CS Pathologie Tanger', title: 'Laboratoire Histopathologie/CS Pathologie Tanger' },
    { id: 'Laboratoire Microbiologie/CS Pathologie Tanger', title: 'Laboratoire Microbiologie/CS Pathologie Tanger' },
    { id: 'Lab. de Physiologie et nutrition/CR Agadir', title: 'Lab. de Physiologie et nutrition/CR Agadir' },
    { id: 'Station Piscicole de M’diq/CS Zootechnie et Ingénierie Aquacoles Marines M’diq', title: 'Station Piscicole de M’diq/CS Zootechnie et Ingénierie Aquacoles Marines M’diq' },
    { id: 'Station conchylicole d’Amsa/CS Zootechnie et Ingénierie Aquacoles Marines M’diq', title: 'Station conchylicole d’Amsa/CS Zootechnie et Ingénierie Aquacoles Marines M’diq' },
    { id: 'Lab. des Technologies Aquacoles/CS Zootechnie et Ingénierie Aquacoles Marines M’diq', title: 'Lab. des Technologies Aquacoles/CS Zootechnie et Ingénierie Aquacoles Marines M’diq' },
    { id: 'Station aquacole Dakhla/CR Dakhla', title: 'Station aquacole Dakhla/CR Dakhla' },
    { id: 'Centre Régional de Nador', title: 'Centre Régional de Nador' },
    { id: 'Centre Régional de Tanger', title: 'Centre Régional de Tanger' },
    { id: 'Centre Régional de Casablanca', title: 'Centre Régional de Casablanca' },
    { id: 'Centre Régional d\'Agadir', title: 'Centre Régional d\'Agadir' },
    { id: 'Centre Régional de Laayoune', title: 'Centre Régional de Laayoune' },
    { id: 'Centre Régional de Dakhla', title: 'Centre Régional de Dakhla' },
    { id: 'Centre Spécialisé en Valorisation et Technologie des Produits de la Mer à Agadir', title: 'Centre Spécialisé en Valorisation et Technologie des Produits de la Mer à Agadir' },
    { id: 'Centre Spécialisé en Pathologie des Animaux Aquatiques à Tanger', title: 'Centre Spécialisé en Pathologie des Animaux Aquatiques à Tanger' },
    { id: 'Centre Spécialisé en « Zootechnie et Ingénierie Aquacole à M’diq', title: 'Centre Spécialisé en « Zootechnie et Ingénierie Aquacole à M’diq' },
    { id: 'Station Piscicole de M’diq', title: 'Station Piscicole de M’diq' },
    { id: 'Station conchylicole d’Amsa', title: 'Station conchylicole d’Amsa' },
    { id: 'Station aquacole Dakhla', title: 'Station aquacole Dakhla' },
    { id: 'Centre des système d\'information', title: 'Centre des système d\'information' },
    { id: 'Comité Scientifique', title: 'Comité Scientifique' },
    { id: 'Service Qualité', title: 'Service Qualité' },
    { id: 'Service Communication', title: 'Service Communication' },
    { id: 'Service suivi des prestation de service', title: 'Service suivi des prestation de service' },
    { id: 'Division Audit et Contrôle de gestion', title: 'Division Audit et Contrôle de gestion' },
  ];
  typesAvisOptions = [
    { id: 'consultatif', title: 'Consultatif' },
    { id: 'reglementaire', title: 'Règlementaire' },
    { id: 'technique', title: 'Technique' },
    { id: 'scientifique', title: 'Scientifique' },
  ];
  priseEncharge: any;
  personConcerned: string;
  stepOfProcessing: string[] = [];
  priseEnchargeId: string;
  courriers: any[] = [];

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
    this.traitementAvisBuilder = this.formBuilder.group({
      datePrevisionnelleResponse: [new Date().toISOString().substring(0, 10), Validators.required],
      datePrisecharge: [new Date().toISOString().substring(0, 10), Validators.required],
    });
    this.route.params.subscribe(params => {
      this.priseEnchargeId = params['id'];
    });
    this.getPriseEncharge();
    this.getAllStepOfProcessing();
    this.getAllAssignedTo();
  }

  getAllStepOfProcessing() {
    let allParams = this.buildArgGetAllStepOfProcessing();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessGetAllStepOfProcessing, YstanceHelper.onErrorResponse);
  }

  getPriseEncharge() {
    let allParams = this.buildArgsGetPrisEnCharge();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemByPrimaryKey, allParams).subscribe({ next: this.onSuccessGetPriseEncharge, error: YstanceHelper.onErrorResponse })
  }

  getAllAssignedTo() {
    let allParams = this.buildArgGetAllAssignedTo();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.onSuccessGetAllAssignedTo, YstanceHelper.onErrorResponse);
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

  private getExtension(mimeType: string): string {
    if (mimeType === 'image/png') return '.png';
    if (mimeType === 'application/pdf') return '.pdf';
    if (mimeType === 'image/jpeg') return '.jpg';
    return '';
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

  confirmDeleteFile(file: any) {
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
        let args = {
          entity: file,
          entityName: environment.entityNameCourrierscientific,
          databaseProvider: 'mongodb',
          primaryKeyName: '_id',
          primaryKeyValue: file._id
        };
        this.ystanceService.apiHandler(YstanceEndPoints.deleteItem, args).subscribe({
          next: () => {
            this.courriers = this.courriers.filter(c => c._id !== file._id);
            YstanceHelper.notify('Courrier supprimé', null, 'success', 1800, null);
          },
          error: YstanceHelper.onErrorResponse
        });
      }
    });
  }

  private scrollToFirstError() {
    setTimeout(() => {
      const firstError = document.querySelector('.ng-invalid, .is-invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }

  saveTraitementAvis() {
    if (!this.traitementAvisBuilder.valid) {
      this.traitementAvisBuilder.markAllAsTouched();
      this.scrollToFirstError();
      return;
    }
    let allParams = this.buildArgTraitementAvis();
    this.ystanceService.apiHandler(YstanceEndPoints.updateItemByPrimaryKey, allParams).subscribe({ next: this.onSuccessInsertTraitementAvis, error: YstanceHelper.onErrorResponse });
  }

  formatRegion(region: any): string {
    if (!region) {
      return '';
    }
    return Array.isArray(region) ? region.join(', ') : region;
  }

  /* #endregion */

  /* #region Popup */

  onAddItem(event: any) {
    let newEntity = {
      title: event.NameItem,
    };
    event.OhmComponent.insertNewItem(newEntity);
  }

  onChangePersonConcerned(event: any) {
    this.personConcerned = event.title;
  }

  onChangeStepOfProcessing(event: any) {
    if (Array.isArray(event)) {
      this.stepOfProcessing = event.map((e: any) => e.title);
    } else {
      this.stepOfProcessing = event ? [event.title] : [];
    }
  }

  /* #endregion */

  /* #region Build Params */

  buildArgsGetPrisEnCharge() {
    let args = {
      primaryKeyName: '_id',
      primaryKeyValue: this.priseEnchargeId,
      entityName: environment.entityNameAvisScientifique,
      databaseProvider: "mongodb"
    }
    return args;
  }

  buildArgTraitementAvis() {
    this.priseEncharge['datePrevisionnelleResponse'] = this.traitementAvisBuilder.value.datePrevisionnelleResponse,
      this.priseEncharge['datePrisecharge'] = this.traitementAvisBuilder.value.datePrisecharge,
      this.priseEncharge['espaceTraitement'] = this.stepOfProcessing,
      this.priseEncharge['personConcerned'] = this.personConcerned,
      this.priseEncharge['statut'] = "statut2"
    let args = {
      entityChanges: this.priseEncharge,
      entityName: environment.entityNameAvisScientifique,
      databaseProvider: 'mongodb',
      primaryKeyName: '_id',
      primaryKeyValue: this.priseEncharge._id
    }
    return args;
  }

  buildArgGetAllStepOfProcessing() {
    let args = {
      filters: [],
      entityName: environment.entityNameStepsProcessingAvisScientifique,
      databaseProvider: "mongodb"
    }
    return args;
  }

  buildArgGetAllAssignedTo() {
    let args = {
      filters: [],
      entityName: environment.entityNamePersonnesConcernesAvisScientifique,
      databaseProvider: "mongodb"
    }
    return args;
  }

  /* #endregion */

  /* #region Arrow Function */

  onSuccessGetPriseEncharge = (data: any) => {
    this.priseEncharge = data;
    if (data.datePrevisionnelleResponse) {
      this.traitementAvisBuilder.patchValue({ datePrevisionnelleResponse: data.datePrevisionnelleResponse });
    }
    if (data.datePrisecharge) {
      this.traitementAvisBuilder.patchValue({ datePrisecharge: data.datePrisecharge });
    }
    if (data.personConcerned) {
      this.personConcerned = data.personConcerned;
    }
    if (data.espaceTraitement) {
      this.stepOfProcessing = Array.isArray(data.espaceTraitement) ? data.espaceTraitement : [data.espaceTraitement];
    }
    this.loadCourriers();
  }

  onSuccessGetAllAssignedTo = (data: any) => {
    this.listAssignedTo = data
  }

  onSuccessInsertTraitementAvis = (data: any) => {
    YstanceHelper.notify('Ajouté avec succès', null, 'success', 1800, null);
  }

  onSuccessGetAllStepOfProcessing = (data: any) => {
    this.stepsOfProcessing = data
  }

  onSuccessLoadCourriers = (data: any) => {
    this.courriers = data;
  }

  /* #endregion */

}

