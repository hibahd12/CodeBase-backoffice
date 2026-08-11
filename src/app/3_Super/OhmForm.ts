import { Directive, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { YstanceEndPoints } from "../1_Commons/YstanceEndPoints";
import { YstanceHelper } from "../1_Commons/YstanceHelper";
import { SessionManager } from "../2_Services/SessionManager";
import { YstanceService } from "../2_Services/YstanceService";
import { HttpClient } from "@angular/common/http";

@Directive()
export class OhmForm implements OnInit {

    /* #region Variables */

    entity: any;
    form: FormGroup;
    formLoaded: boolean = false;
    mode: string;
    idEntity: string;
    entityName: string;
    formTitle: string;

    /* #endregion */

    /* #region Constructor */

    constructor(
        public ystanceService: YstanceService,
        public router: Router,
        public http: HttpClient,
        public route: ActivatedRoute,
        public sessionManager: SessionManager,
        public formBuilder: FormBuilder,
    ) { }

    /* #endregion */

    /* #region init & loading */

    ngOnInit() {
        let params = this.router.parseUrl(this.router.url);
        this.mode = this.mode || params.queryParams["Mode"];
        this.route.params.subscribe(params => {
            this.idEntity = params['id'];
        });
        this.mode = this.idEntity ? "Edit" : "Add";
        this.initialisationParametres();
        this.initializeFormBuilder(null);
        if (this.mode == "Edit" && this.idEntity) {
            this.loadDataItem();
        }
    }

    initialisationParametres() {
    }

    loadDataItem() {
        let args = this.buildParamsGetItem();
        this.ystanceService.apiHandler(YstanceEndPoints.getItemByPrimaryKey, args).subscribe({ next: this.onSuccessLoadDataItem });
    }

    afterLoadItem() {
    }

    /* #endregion */

    /* #region Local Events */

    formSaveHandler() {
        if (this.form.valid) {
            let entity = this.form.value;
            if (this.mode == 'Edit') {
                let allParams = this.buildParamsUpdateItem(entity);
                this.ystanceService.apiHandler(YstanceEndPoints.updateItemByPrimaryKey, allParams).subscribe({ next: this.onSuccessformSaveHandlerUpdateItem, error: YstanceHelper.onErrorResponse });
            }
            else if (this.mode == 'Add') {
                let allParams = this.buildParamsInsertItem(entity);
                this.ystanceService.apiHandler(YstanceEndPoints.insertItem, allParams).subscribe({ next: this.onSuccessformSaveHandlerInsertItem, error: YstanceHelper.onErrorResponse });
            }
        }
        else {
            YstanceHelper.notify('Failed to Add !', 'An error occurred while saving.', 'error', 1800, null);
        }
    }

    cancel() {
        this.loadDataItem();
    }

    afterSavingMessage(success: boolean, error?: any) {
        if (success) {
            YstanceHelper.notify(null, 'Ajouté avec succès.', 'success', 1800, null);
        } else {
            YstanceHelper.notify('Failed to Add !', 'An error occurred while saving.', 'error', 1800, null);
        }
    }

    /* #endregion */

    /* #region Build Params */

    buildParamsInsertItem(entity: any) {
        let args = {
            entityChanges: entity,
            entityName: this.entityName,
            databaseProvider: 'mongodb'
        }
        return args;
    }

    buildParamsGetItem() {
        let args = {
            entityName: this.entityName,
            databaseProvider: 'mongodb',
            primaryKeyName: '_id',
            primaryKeyValue: this.idEntity
        }
        return args;
    }

    buildParamsUpdateItem(entity: any) {
        let updatedEntity = { ...this.entity, ...entity };
        let args = {
            entityChanges: updatedEntity,
            entityName: this.entityName,
            databaseProvider: 'mongodb',
            primaryKeyName: '_id',
            primaryKeyValue: this.idEntity
        }
        return args;
    }

    /* #endregion */

    /* #region Forms */

    setCurrentFormValue() {
        this.sessionManager.setCurrentFormValue(this.form.value);
        this.form.valueChanges.subscribe(
            data => {
                this.sessionManager.setCurrentFormValue(data);
            },
            error => {
                console.log(error)
            })
    }

    initializeFormBuilder(entity: any): void {

    }

    /* #endregion */

    /* #region Arrow functions */

    onSuccessLoadDataItem = (data: any) => {
        this.entity = data;
        this.formLoaded = true;
        this.initializeFormBuilder(this.entity);
        this.afterLoadItem();
    }

    onSuccessformSaveHandlerUpdateItem = (data: any) => {
        this.loadDataItem();
        this.afterSavingMessage(true);
    }

    onSuccessformSaveHandlerInsertItem = (data: any) => {
        this.idEntity = data.id;
        this.entity = data;
        this.loadDataItem();
        this.afterSavingMessage(true);
        this.mode = 'Edit';
    }

    /* #endregion */

}