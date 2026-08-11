import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// C-16: CKEditorModule retiré (code mort)
import { ArchwizardModule } from 'angular-archwizard';
import { NgxMaskModule } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ColorPickerModule } from 'ngx-color-picker';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

// FlatPicker
import { FlatpickrModule } from 'angularx-flatpickr';

import { UIModule } from '../../shared/ui/ui.module';
import { FormRoutingModule } from './form-routing.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  // tslint:disable-next-line: max-line-length
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormRoutingModule,
    HttpClientModule,
    UIModule,
    ArchwizardModule,
    NgxMaskModule.forRoot(),
    NgSelectModule,
    UiSwitchModule,
    ColorPickerModule,
    BsDatepickerModule.forRoot(),
    DropzoneModule,
    FlatpickrModule.forRoot()
  ]
})
export class FormModule { }
