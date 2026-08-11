import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { YstanceService } from 'src/app/2_Services/YstanceService';
// import { YstanceEndPoints } from 'src/app/Ystance/YstanceEndPoints';
// import { YstanceHelper } from 'src/app/Ystance/YstanceHelper';
// import { YstanceService } from 'src/app/Ystance/YstanceService';s

@Component({
  selector: 'app-repeater',
  templateUrl: './repeater.component.html',
  styleUrls: ['./repeater.component.scss']
})

/**
 * Form repeater component
 */
export class RepeaterComponent implements OnInit {

  /* #region Variables */

  breadCrumbItems: Array<{}>;
  Ports: any = [];
  assignedToOptions = [
    { name: 'Najd' },
    { name: 'Directeur' },
    { name: 'secrétaire Général' },
    { name: 'Département Pêche' },
    { name: 'Département Surveillance et Suivi du Milieu Marin' },
    { name: 'Département Aquaculture' },
    { name: 'Département Océanographie' },
    { name: 'Département d\'Appui à la recherche' },
    { name: 'Lab. Biologie Ecologie/CR Casablanca' },
    { name: 'Cellule pêche/CR Casablanca' },
    { name: 'Lab. Evaluation des Ressources Littorales/CR Casablanca' },
    { name: 'Lab. d’évaluation et de suivi des Pêcheries/CR Casablanca' },
    { name: 'Lab. Pêche/CR Nador' },
    { name: 'Lab. Pêche/CR Laayoune' },
    { name: 'Lab. Pêche/CR Tanger' },
    { name: 'Lab. Pêche/CR Dakhla' },
    { name: 'Lab. Pêche/CR Agadir' },
    { name: 'Lab. de Prospections Acoustiques/CR Agadir' },
    { name: 'Lab.de Génétique des populations halieutiques/CR Agadir' },
    { name: 'Lab. de Prospections Demersales/CR Agadir' },
    { name: 'Lab. d’Economie des Pêches/CR Agadir' },
    { name: 'Lab. Surveillance et Suivi du Milieu Marin/CR Nador' },
    { name: 'Lab. Surveillance et Suivi du Milieu Marin/CR Tanger' },
    { name: 'Lab. Surveillance et Suivi du Milieu Marin/CR Agadir' },
    { name: 'Lab. Surveillance et Suivi du Milieu Marin/CR Laayoune' },
    { name: 'Lab. Surveillance et Suivi du Milieu Marin/CR Dakhla' },
    { name: 'Station Surveillance et Suivi du Milieu Marin d\'Oualidia/CR Casablanca' },
    { name: 'Lab. des Biotoxines Marines/CR Casablanca' },
    { name: 'Lab. de Chimie/CR Casablanca' },
    { name: 'Lab. d’Ecotoxicologie/CR Casablanca' },
    { name: 'Lab. de phytoplancton et des Efflorescences Nuisibles/CR Casablanca' },
    { name: 'Lab. de Chimie/CR Tanger' },
    { name: 'Lab. de Génie Alimentaire/CS Valorisation' },
    { name: 'Lab. de Contrôle Qualité/CS Valorisation' },
    { name: 'Lab. de Biotechnologie/CS Valorisation' },
    { name: 'Lab. d’Ecologie du Plancton Marin/CR Casablanca' },
    { name: 'Lab. de Physique et Bio-géochimie Marine/CR Casablanca' },
    { name: 'Lab. de Modélisation Océanographique et écosystémique/CR Tanger' },
    { name: 'Laboratoire Histopathologie/CS Pathologie Tanger' },
    { name: 'Laboratoire Microbiologie/CS Pathologie Tanger' },
    { name: 'Lab. de Physiologie et nutrition/CR Agadir' },
    { name: 'Station Piscicole de M’diq/CS Zootechnie et Ingénierie Aquacoles Marines M’diq' },
    { name: 'Station conchylicole d’Amsa/CS Zootechnie et Ingénierie Aquacoles Marines M’diq' },
    { name: 'Lab. des Technologies Aquacoles/CS Zootechnie et Ingénierie Aquacoles Marines M’diq' },
    { name: 'Station aquacole Dakhla/CR Dakhla' },
    { name: 'Centre Régional de Nador' },
    { name: 'Centre Régional de Tanger' },
    { name: 'Centre Régional de Casablanca' },
    { name: 'Centre Régional d\'Agadir' },
    { name: 'Centre Régional de Laayoune' },
    { name: 'Centre Régional de Dakhla' },
    { name: 'Centre Spécialisé en Valorisation et Technologie des Produits de la Mer à Agadir' },
    { name: 'Centre Spécialisé en Pathologie des Animaux Aquatiques à Tanger' },
    { name: 'Centre Spécialisé en « Zootechnie et Ingénierie Aquacole à M’diq' },
    { name: 'Station Piscicole de M’diq' },
    { name: 'Station conchylicole d’Amsa' },
    { name: 'Station aquacole Dakhla' },
    { name: 'Centre des système d\'information' },
    { name: 'Comité Scientifique' },
    { name: 'Service Qualité' },
    { name: 'Service Communication' },
    { name: 'Service suivi des prestation de service' },
    { name: 'Division Audit et Contrôle de gestion' },
  ];
  typesAvisOptions = [
    { id: 'consultatif', name: 'Consultatif' },
    { id: 'reglementaire', name: 'Règlementaire' },
    { id: 'technique', name: 'Technique' },
    { id: 'scientifique', name: 'Scientifique' },
  ];
  priseEncharge: any
  priseEnchargeId: string;
  Date: Date;
  dateResponse: Date;
  datePrisecharge: Date;
  nature: string;
  selectedPort: string;
  Emetteur: string;
  beneficiaire: string;
  Ref_courrier: string;
  Courrier_recu: string;
  region: string;
  espaceTraitement: string;
  sujet: string;

  /* #endregion */

  /* #region Constructor */

  constructor(
    private ystanceService: YstanceService,
    private route: ActivatedRoute
  ) { }

  /* #endregion */

  /* #region Init and Loading */

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Form Repeater', active: true }];
    this.route.params.subscribe(params => {
      this.priseEnchargeId = params['id'];
    });
    this.GetPriseEncharge()
  }

  GetPriseEncharge() {
    let allParams = this.BuildGetPrisEnCharge();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.OnSuccessGetPriseEncharge, YstanceHelper.onErrorResponse);
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

  SaveTraitementAvis() {
    let allParams = this.BuildTraitementAvis();
  }

  /* #endregion */

  /* #region Build Params */

  BuildGetPrisEnCharge() {
    let args = {
      filters: [{
        property: 'id',
        value: this.priseEnchargeId,
      }],
      entityName: "prisencharge",
      databaseProvider: "mongodb"
    }
    return args;
  }

  BuildTraitementAvis() {
    let user = JSON.parse(sessionStorage.getItem('currentUser')!);
    this.priseEncharge['date_response'] = this.dateResponse
    this.priseEncharge['date_prisecharge'] = this.datePrisecharge
    this.priseEncharge['espace_traitement'] = this.espaceTraitement
    let args = {
      entityChanges: this.priseEncharge,
      entityName: 'prisencharge',
      databaseProvider: 'mongodb',
      primaryKeyName: '_id',
      primaryKeyValue: this.priseEncharge._id
    }
    return args;
  }

  /* #endregion */

  /* #region Arrow Function */

  OnSuccessGetPriseEncharge = (data: any) => {
    this.priseEncharge = data[0]
    this.Date = data[0].date_creation;
    this.nature = data[0].type;
    this.Emetteur = data[0].emetteur;
    this.Ref_courrier = data[0].ref_courrier;
    this.Courrier_recu = data[0].courrier_recu;
    this.beneficiaire = data[0].beneficiaire;
    this.sujet = data[0].sujet;
    this.region = data[0].region;
  }

  OnSuccessGetPorts = (data: any) => {
    this.Ports = data.ports
  }

  OnSuccessInsertTraitementAvis = (data: any) => {
  }

  /* #endregion */
}

