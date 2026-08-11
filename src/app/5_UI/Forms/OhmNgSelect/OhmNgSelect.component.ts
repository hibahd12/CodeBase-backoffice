import { Component, EventEmitter, Input, OnInit, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { YstanceEndPoints } from 'src/app/1_Commons/YstanceEndPoints';
import { YstanceHelper } from 'src/app/1_Commons/YstanceHelper';
import { YstanceService } from 'src/app/2_Services/YstanceService';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

const SELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => OhmNgSelectComponent),
  multi: true,
};

@Component({
  selector: 'OhmNgSelect',
  templateUrl: './OhmNgSelect.component.html',
  styleUrls: ['./OhmNgSelect.component.scss'],
  providers: [SELECT_VALUE_ACCESSOR]
})

export class OhmNgSelectComponent implements OnInit, ControlValueAccessor {

  /* #region Variables */

  @Output() loadData = new EventEmitter();
  @Output() eventEmitterOnChange = new EventEmitter();
  @Output() eventEmitterOnFocus = new EventEmitter();
  @Output() eventEmitterOnAdd = new EventEmitter();
  @Input() items: any[] = [];
  @Input() unableAddButton: boolean = true;
  @Input() unableEditButton: boolean = true;
  @Input() placeholder: string;
  @Input() entityName: string;
  @Input() bindLabel: string;
  @Input() bindValue: string;
  @Input() noBindLabel: boolean = false;
  @Input() multiple: boolean = true;
  innerValue: string;
  isButtonDisabled: boolean = false;
  onChange = (value: any) => { };
  userIsAdmin: boolean = false;

  /* #endregion */

  /* #region Constructor */

  constructor(
    private ystanceService: YstanceService,
    public formBuilder: FormBuilder,
  ) {
  }

  /* #endregion */

  /* #region Init and Loading */

  ngOnInit() {
    this.checkIfCurrentUserIsAdmin();
  }

  checkIfCurrentUserIsAdmin() {
    const currentUserString = sessionStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser = JSON.parse(currentUserString);
      this.getIdProfileConnected(currentUser?.iduser).then((idProfile: any) => {
        if (idProfile === environment.idProfilAdmin) {
          this.userIsAdmin = true;
        }
      }).catch((error) => {
        console.error('Error fetching profile:', error);
      });
    }
  }

  getIdProfileConnected(idUser: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let args = {
        entityName: "yuserprofile",
        databaseProvider: "mysql",
        filters: [{ property: "iduser", value: idUser }],
      };
      this.ystanceService.apiHandler(YstanceEndPoints.getItemsByFilters, args).subscribe(
        (data: any) => {
          if (data && data.length > 0) {
            resolve(data[0].idprofile);
          } else {
            reject('No profile found');
          }
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  writeValue(value: any) {
    this.innerValue = value;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(): void {
  }

  updateValue(value: any) {
    this.innerValue = value;
    this.onChange(this.innerValue);
  }

  /* #endregion */

  /* #region Events */

  onItemSelectedChange(event: any) {
    this.eventEmitterOnChange.emit(event);
  }

  onItemSelectedFocus(event: any) {
    this.eventEmitterOnFocus.emit(event);
  }

  addItemToList(searchTerm: string) {
    if (!searchTerm || searchTerm.trim() === '') {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le champ ne doit pas être vide',
        confirmButtonText: 'OK'
      });
      this.isButtonDisabled = false;
      return;
    }

    this.isButtonDisabled = true;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger ms-2'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons
      .fire({
        title: 'Êtes-vous sûr?',
        text: 'Vous ne pourrez pas revenir en arrière!',
        icon: 'warning',
        confirmButtonText: 'Oui, ajoutez-le!',
        cancelButtonText: 'Non, annulez!',
        showCancelButton: true
      })
      .then(result => {
        if (result.value) {
          this.eventEmitterOnAdd.emit({ NameItem: searchTerm, OhmComponent: this });
          swalWithBootstrapButtons.fire(
            'Ajouté!',
            'Votre élément a été ajouté.',
            'success'
          );
        }
      });
  }

  editItem(item: any) {
    Swal.fire({
      title: 'Modifier',
      input: 'text',
      inputValue: item[this.bindLabel],
      showCancelButton: true,
      confirmButtonText: 'Enregistrer',
      cancelButtonText: 'Annuler',
      preConfirm: (newValue) => {
        if (!newValue || newValue.trim() === '') {
          Swal.showValidationMessage('Le champ ne doit pas être vide');
          return false;
        }
        item[this.bindLabel] = newValue;
        this.updateItem(item);
      }
    });
  }

  insertNewItem(newItem: any) {
    let allParams = this.buildInsertItem(newItem);
    this.ystanceService.apiHandler(YstanceEndPoints.insertItem, allParams).subscribe(this.onsuccessAddNewItem, YstanceHelper.onErrorResponse);
  }

  updateItem(item: any) {
    let allParams = this.buildUpdateItem(item);
    this.ystanceService.apiHandler(YstanceEndPoints.updateItemByPrimaryKey, allParams).subscribe(this.onsuccessUpdateItem, YstanceHelper.onErrorResponse);
  }

  /* #endregion */

  /* #region Build Params */

  buildInsertItem(newEntity: any) {
    let args = {
      entityChanges: newEntity,
      entityName: this.entityName,
      databaseProvider: 'mongodb'
    }
    return args;
  }

  buildUpdateItem(Entity: any) {
    let args = {
      entityChanges: Entity,
      entityName: this.entityName,
      databaseProvider: 'mongodb',
      primaryKeyName: '_id',
      primaryKeyValue: Entity._id
    }
    return args;
  }

  /* #endregion */

  /* #region Arrow Function */

  onsuccessAddNewItem = (data: any) => {
    YstanceHelper.notify('Ajouté avec succès', null, 'success', 1800, null);
    this.loadData.emit();
    this.isButtonDisabled = false;
  }

  onsuccessUpdateItem = (data: any) => {
    YstanceHelper.notify('Successfully updated', null, 'success', 1800, null);
    this.loadData.emit();
  }

  /* #endregion */

}