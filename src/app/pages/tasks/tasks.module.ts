import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// C-16: CKEditorModule retiré (templates utilisent <textarea>)
import { DndModule } from 'ngx-drag-drop';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { TasksRoutingModule } from './tasks-routing.module';
import { UIModule } from '../../shared/ui/ui.module';

import { ListComponent } from './list/list.component';
import { KanbanboardComponent } from './kanbanboard/kanbanboard.component';
import { CreatetaskComponent } from './createtask/createtask.component';

@NgModule({
  declarations: [ListComponent, KanbanboardComponent, CreatetaskComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TasksRoutingModule,
    UIModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    DndModule,
    BsDropdownModule.forRoot()
  ]
})
export class TasksModule { }
