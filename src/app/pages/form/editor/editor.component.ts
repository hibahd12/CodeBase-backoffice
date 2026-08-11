import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// C-16: CKEditor retiré — code mort (template Skote inutilisé), aucun <ckeditor> rendu
import { SessionManager } from 'src/app/Ystance/SessionManager';
import { YstanceEndPoints } from 'src/app/Ystance/YstanceEndPoints';
import { YstanceHelper } from 'src/app/Ystance/YstanceHelper';
import { YstanceService } from 'src/app/Ystance/YstanceService';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})

/**
 * Form-editor component
 */
export class EditorComponent implements OnInit {

  /* #region Variables */

  breadCrumbItems: Array<{}>;
  AllPriseEncharges: any = [];
  priseEnchargeId: string;
  // C-16: public Editor = ClassicEditor; retiré (code mort)

  /* #endregion */

  /* #region Constructor */

  constructor(
    private ystanceService: YstanceService,
    private router: Router,
    public sessionManager: SessionManager,

  ) { }

  /* #endregion */

  /* #region Init and Loading */

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Form Editor', active: true }];
    this.GetAllPrisEnCharge()
  }

  GetAllPrisEnCharge() {
    let allParams = this.BuildGetAllPrisEnCharge();
    this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, allParams).subscribe(this.OnSuccessGetAllPrisEnCharge, YstanceHelper.onErrorResponse);
  }

  /* #endregion */

  /* #region Build Params */

  BuildGetAllPrisEnCharge() {
    let args = {
            filters: [],
      entityName: "prisencharge",
      databaseProvider: "mongodb"
    }
    return args;
  }

  /* #endregion */

  /* #region Events */

  openTraitementAvis(priseEncharge: any) {
    this.router.navigate(['/form/repeater', priseEncharge.id]);
  }

  openResultat(priseEncharge : any){
    this.router.navigate(['/form/mask', priseEncharge.id]);
  }

  AddNewAvisScientifique() {
    this.router.navigate(['/form/advanced']);

  }

  /* #endregion */

  /* #region Arrow functions  */

  OnSuccessGetAllPrisEnCharge = (data: any) => {
    this.AllPriseEncharges = data
  }

  /* #endregion */

}
