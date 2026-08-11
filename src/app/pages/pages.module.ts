import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { FullCalendarModule } from '@fullcalendar/angular';
import { LightboxModule } from 'ngx-lightbox';
import { SimplebarAngularModule } from 'simplebar-angular';

import { UIModule } from '../shared/ui/ui.module';
import { WidgetModule } from '../shared/widget/widget.module';

// Emoji Picker
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { PagesRoutingModule } from './pages-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { BlogModule } from "./blog/blog.module";
import { CalendarComponent } from './calendar/calendar.component';
import { ChartModule } from './chart/chart.module';
import { ChatComponent } from './chat/chat.component';
import { ContactsModule } from './contacts/contacts.module';
import { CryptoModule } from './crypto/crypto.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { EcommerceModule } from './ecommerce/ecommerce.module';
import { EmailModule } from './email/email.module';
import { FormModule } from './form/form.module';
import { IconsModule } from './icons/icons.module';
import { InvoicesModule } from './invoices/invoices.module';
import { MapsModule } from './maps/maps.module';
import { ProjectsModule } from './projects/projects.module';
import { TablesModule } from './tables/tables.module';
import { TasksModule } from './tasks/tasks.module';
import { UiModule } from './ui/ui.module';
import { UtilityModule } from './utility/utility.module';


import { SessionManager } from '../2_Services/SessionManager';
import { YstanceService } from '../2_Services/YstanceService';
import { FilemanagerComponent } from './filemanager/filemanager.component';

@NgModule({
  declarations: [CalendarComponent, ChatComponent, FilemanagerComponent],
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PagesRoutingModule,
    ReactiveFormsModule,
    EcommerceModule,
    EmailModule,
    InvoicesModule,
    HttpClientModule,
    ProjectsModule,
    UIModule,
    TasksModule,
    BlogModule,
    UtilityModule,
    UiModule,
    FormModule,
    TablesModule,
    IconsModule,
    WidgetModule,
    MapsModule,
    FullCalendarModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    SimplebarAngularModule,
    LightboxModule,
    PickerModule
  ],
  providers: [
    YstanceService,
    SessionManager,
  ]
})
export class PagesModule { }
