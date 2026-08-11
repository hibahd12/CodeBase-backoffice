import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OhmForm } from 'src/app/3_Super/OhmForm';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SessionManager } from 'src/app/2_Services/SessionManager';
import { YstanceService } from 'src/app/2_Services/YstanceService';

@Component({
  selector: 'Sys_DetailsEtatSanitaire',
  templateUrl: './DetailsEtatSanitaire.component.html',
  styleUrls: ['./DetailsEtatSanitaire.component.scss']
})

export class DetailsEtatSanitaireComponent extends OhmForm {

  /* #region Variables */

  environment = environment;
  LabosResponsables: any[] = [];
  TypesProduction: any[] = [];
  EspecesCibles: any[] = [];
  pointSuivi: any;
  zoneSanitaire: any;
  regionSanitaire: any;
  form: FormGroup;

  /* #endregion */

  /* #region Constructor */

  constructor(
    private cdr: ChangeDetectorRef,
    public ystanceService: YstanceService,
    public router: Router,
    public http: HttpClient,
    public route: ActivatedRoute,
    public sessionManager: SessionManager,
    public formBuilder: FormBuilder
  ) {
    super(ystanceService, router, http, route, sessionManager, formBuilder);
    this.form = this.formBuilder.group({
      'point_suivi': new FormControl(null)
    });
  }

  /* #endregion */

  /* #region Init and Loading */

  override initialisationParametres() {
    this.entityName = environment.entityNameEtatSanitaire;
    this.route.params.subscribe(params => {
      this.zoneSanitaire = JSON.parse(params['zoneSanitaire']);
      if (this.pointSuivi == null) {
        this.pointSuivi = JSON.parse(params['pointSuivi']);
      }
      this.regionSanitaire = JSON.parse(params['regionSanitaire']);
      this.initializeFormBuilder();
    });
  }

  override initializeFormBuilder(entity: any = null): void {
    this.form.patchValue({ point_suivi: this.pointSuivi });
    this.setCurrentFormValue();
  }

  /* #endregion */

  /* #region Events */

  goBack() {
    this.router.navigate(['/Sys_FrmEtatSanitaire']);
  }

  onPointSuiviChange(newPointSuivi: any) {
    this.pointSuivi = newPointSuivi;    
    this.cdr.detectChanges();
  }

  /* #endregion */
}