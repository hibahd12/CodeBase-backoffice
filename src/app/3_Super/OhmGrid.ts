import { Directive, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NavigationParams } from "../1_Commons/NavigationParams";
import { YstanceEndPoints } from "../1_Commons/YstanceEndPoints";
import { YstanceHelper } from "../1_Commons/YstanceHelper";
import { RooterManager } from "../2_Services/RooterManager";
import { SessionManager } from "../2_Services/SessionManager";
import { YstanceService } from "../2_Services/YstanceService";

@Directive()
export class OhmGrid implements OnInit {

    //#region Variables

    dataGrid: any = [];
    formGroup: FormGroup;
    formulaireName: string;
    filters: any = [];
    entityName: string;
    orderByField: string = '';
    orderByDirection: string = 'asc';
    databaseProvider = 'mongodb';
    modeEdit: boolean = false;

    //#endregion

    /* #region  Constructor */

    constructor(
        public formBuilder: FormBuilder,
        public ystanceService: YstanceService,
        public router: Router,
        public route: ActivatedRoute,
        public sessionManager: SessionManager,
    ) {
    }

    /* #endregion */

    /* #region init & loading */

    ngOnInit() {
        this.loadParameters();
        this.afterLoadParametres();
    }

    loadParameters() {
        let params = this.router.parseUrl(this.router.url);
    }

    afterLoadParametres() {
        this.loadData();
        this.initializeFormBuilder();
    }

    afterLoadData() {
    }

    loadData() {
        let args = {
            entityName: this.entityName,
            databaseProvider: this.databaseProvider,
            filters: this.filters,
        };
        if (this.orderByField) {
            args['orderByField'] = this.orderByField;
            args['orderByDirection'] = this.orderByDirection;
        }
        this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, args).subscribe({ next: this.onSuccessLoadData, error: YstanceHelper.onErrorResponse });
    }

    /* #endregion */

    /* #region  events MenuActions */

    NavigateToForm(formName: string) {
        this.router.navigate([formName]);
    }

    AddNewForm(formName: string, idType: any) {
        this.router.navigate([formName, idType]);
    }

    openForm(formName: any, dataItem: any) {
        this.router.navigate([formName, dataItem._id]);
    }

    /* #endregion */

    /* #region FucntionsForm */

    initializeFormBuilder(): void {
        this.formGroup = this.formBuilder.group({});
    }

    addEntityInForm() {
        let navParams = new NavigationParams();
        navParams.mode = 'Add';
        let path = this.formulaireName;
        let rooterManager = new RooterManager<any>();
        rooterManager._store = this.sessionManager.getRooterManager()._store;
        rooterManager.GoTo(this.sessionManager, this.router, 'DynamicFormsComponent', path, 'Nouveau', navParams);
    }

    buildFormGroup(entity: any): FormGroup {
        return this.formGroup;
    }

    /* #endregion */

    /* #region Arrow functions */

    onSuccessLoadData = (data: any) => {
        this.dataGrid = data;
        this.afterLoadData();
    }

    onSuccessformSaveHandlerInsertItem = (data: any) => {
        YstanceHelper.notify('Ajouté avec succès', null, 'success', 1800, null);
        this.loadData();
    }

    onSuccessformSaveHandlerUpdateItem = (data: any) => {
        YstanceHelper.notify('Edit successful', 'Changes made have been saved', 'success', 1800, null);
        this.modeEdit = false;
        this.loadData();
    }

    onErrorformSaveHandler = (error: any) => {
        YstanceHelper.onErrorResponse
        this.loadData();
    }

    onSuccessDeleteHandler = (data: any) => {
        YstanceHelper.notify('Successfully deleted', 'Changes made have been saved', 'success', 1800, null);
        this.loadData();
    }

    /* #endregion */

}
