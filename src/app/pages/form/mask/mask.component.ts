import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { YstanceService } from 'src/app/2_Services/YstanceService';


@Component({
  selector: 'app-mask',
  templateUrl: './mask.component.html',
  styleUrls: ['./mask.component.scss']
})

/**
 * Form mask component
 */
export class MaskComponent implements OnInit {

  /* #region Variables */

  breadCrumbItems: Array<{}>;
  priseEncharge: any
  priseEnchargeId: string;
  refAvis: string;
  dateReponseAvis: string;
  UploadReponseAvis: string;
  Observation: string;

  /* #endregion */

  /* #region Constructor */

  constructor(
    private ystanceService: YstanceService,
    private route: ActivatedRoute
  ) { }

  /* #endregion */

  /* #region Init and Loading */

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Mask', active: true }];
    this.route.params.subscribe(params => {
      this.priseEnchargeId = params['id'];
    });
    this.GetPriseEncharge()
  }

  GetPriseEncharge() {
    let allParams = this.BuildGetPrisEnCharge();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.OnSuccessGetPriseEncharge, YstanceHelper.onErrorResponse);
  }

  SaveResultat() {
    let allParams = this.BuildResultat();
    this.ystanceService.apiHandler(YstanceEndPoints.updateItemByPrimaryKey, allParams).subscribe(this.OnSuccessInsertTraitementAvis, YstanceHelper.onErrorResponse);
  }

  /* #endregion */

  /* #region Events */

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

  BuildResultat() {
    let user = JSON.parse(sessionStorage.getItem('currentUser')!);
    this.priseEncharge['ref_avis'] = this.refAvis
    this.priseEncharge['date_reponse_avis'] = this.dateReponseAvis
    this.priseEncharge['upload_reponse_avis'] = this.UploadReponseAvis
    this.priseEncharge['observation'] = this.Observation
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
  }

  OnSuccessInsertTraitementAvis = (data: any) => {
  }

  /* #endregion */
}

