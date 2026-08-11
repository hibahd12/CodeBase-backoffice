import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ModalModule } from 'ngx-bootstrap/modal';
import { FrmAvisScientificComponent } from '../5_UI/Forms/FrmAvisScientific/FrmAvisScientific.component';
import { FrmCampagnesComponent } from '../5_UI/Forms/FrmCampagnes/FrmCampagnes.component';
import { FrmDemandeAlerteComponent } from '../5_UI/Forms/FrmDemandeAlerte/FrmDemandeAlerte.component';
import { FrmEtatSanitaireComponent } from '../5_UI/Forms/FrmEtatSanitaire/FrmEtatSanitaire.component';
import { FrmPriseEnChargeComponent } from '../5_UI/Forms/FrmPriseEnCharge/FrmPriseEnCharge.component';
import { FrmResultatComponent } from '../5_UI/Forms/FrmResultat/FrmResultat.component';
import { FrmTraitementAvisComponent } from '../5_UI/Forms/FrmTraitementAvis/FrmTraitementAvis.component';
import { AvisScientifiquesComponent } from '../5_UI/Lists/AvisScientifiques/AvisScientifiques.component';
import { CampagnesComponent } from '../5_UI/Lists/Campagnes/Campagnes.component';
import { DashboardComponent } from '../5_UI/Lists/Dashboard/Dashboard.component';
import { EtatSanitaireComponent } from '../5_UI/Lists/EtatSanitaire/EtatSanitaire.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { FilemanagerComponent } from './filemanager/filemanager.component';
import { AlertesEnvironementComponent } from '../5_UI/Lists/AlertesEnvironement/AlertesEnvironement.component';
import { AlerteSanitaireComponent } from '../5_UI/Lists/AlerteSanitaire/AlerteSanitaire.component';
import { DetailsEtatSanitaireComponent } from '../5_UI/Forms/DetailsEtatSanitaire/DetailsEtatSanitaire.component';
import { EtatSanitaireGeneraleComponent } from '../4_Component/EtatSanitaireGenerale/EtatSanitaireGenerale.component';
import { DocumentsUtilesComponent } from '../5_UI/Lists/documentsUtiles/documentsUtiles.component';
import { FrmDocumentComponent } from '../5_UI/Forms/frmDocument/frmDocument.component';
import { FrmUpdateAlertEnvironnementComponent } from '../5_UI/Forms/FrmUpdateAlertEnvironnement/FrmUpdateAlertEnvironnement.component';

const routes: Routes = [

  { path: "", component: AlerteSanitaireComponent },
  { path: 'PlanificationCampagnes', component: CampagnesComponent },
  { path: 'AlerteEnvironnement', component: AlertesEnvironementComponent },
  { path: 'AlerteSanitaire', component: AlerteSanitaireComponent },
  { path: 'EtatSanitaire', component: EtatSanitaireComponent },
  { path: 'AvisScientifiques', component: AvisScientifiquesComponent },
  { path: 'DocumentsUtiles', component: DocumentsUtilesComponent },
  { path: 'Sys_FrmPriseEnCharge', component: FrmPriseEnChargeComponent },
  { path: 'Sys_FrmAvisScientific/:id', component: FrmAvisScientificComponent },
  { path: 'Sys_FrmTraitementAvis/:id', component: FrmTraitementAvisComponent },
  { path: 'Sys_FrmResultat/:id', component: FrmResultatComponent },
  { path: 'Sys_FrmDemandeAlerte', component: FrmDemandeAlerteComponent },
  { path: 'Sys_FrmCampagnes/:id', component: FrmCampagnesComponent },
  { path: 'Sys_FrmDemandeAlerte/:id', component: FrmDemandeAlerteComponent },
  { path: 'Sys_FrmUpdateDemandeAlerte/:id', component: FrmUpdateAlertEnvironnementComponent },
  { path: 'Sys_FrmCampagnes', component: FrmCampagnesComponent },
  { path: 'Sys_FrmEtatSanitaire', component: FrmEtatSanitaireComponent },
  { path: 'Sys_FrmEtatSanitaire/:id', component: FrmEtatSanitaireComponent },
  { path: 'EtatSanitaireGenerale/:id', component: EtatSanitaireGeneraleComponent },
  { path: 'Sys_DetailsEtatSanitaire/:id', component: DetailsEtatSanitaireComponent },
  { path: 'Sys_FrmDocument', component: FrmDocumentComponent },  

  { path: 'calendar', component: CalendarComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'filemanager', component: FilemanagerComponent },
  { path: 'dashboards', loadChildren: () => import('./dashboards/dashboards.module').then(m => m.DashboardsModule) },
  { path: 'ecommerce', loadChildren: () => import('./ecommerce/ecommerce.module').then(m => m.EcommerceModule) },
  { path: 'crypto', loadChildren: () => import('./crypto/crypto.module').then(m => m.CryptoModule) },
  { path: 'email', loadChildren: () => import('./email/email.module').then(m => m.EmailModule) },
  { path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule) },
  { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule) },
  { path: 'tasks', loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule) },
  { path: 'contacts', loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule) },
  { path: 'blog', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule) },
  { path: 'pages', loadChildren: () => import('./utility/utility.module').then(m => m.UtilityModule) },
  { path: 'ui', loadChildren: () => import('./ui/ui.module').then(m => m.UiModule) },
  { path: 'form', loadChildren: () => import('./form/form.module').then(m => m.FormModule) },
  { path: 'tables', loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule) },
  { path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
  { path: 'charts', loadChildren: () => import('./chart/chart.module').then(m => m.ChartModule) },
  { path: 'maps', loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule) },
  { path: 'jobs', loadChildren: () => import('./jobs/jobs.module').then(m => m.JobsModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes),
  ModalModule.forRoot(),],
  exports: [RouterModule]
})

export class PagesRoutingModule { }
