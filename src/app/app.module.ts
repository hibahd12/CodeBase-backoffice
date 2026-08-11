import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { ArchwizardModule } from 'angular-archwizard';
import { ChartsModule } from 'ng2-charts';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxChartistModule } from 'ngx-chartist';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxMaskModule } from 'ngx-mask';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ToastrModule } from 'ngx-toastr';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { SessionManager } from './2_Services/SessionManager';
import { EtatSanitaireBiotoxineEspece1Component } from './4_Component/EtatSanitaireBiotoxineEspece1/EtatSanitaireBiotoxineEspece1.component';
import { EtatSanitaireBiotoxineEspece2Component } from './4_Component/EtatSanitaireBiotoxineEspece2/EtatSanitaireBiotoxineEspece2.component';
import { EtatSanitaireContamiChimiqueComponent } from './4_Component/EtatSanitaireContamiChimique/EtatSanitaireContamiChimique.component';
import { EtatSanitaireContamiMicroComponent } from './4_Component/EtatSanitaireContamiMicro/EtatSanitaireContamiMicro.component';
import { EtatSanitaireGeneraleComponent } from './4_Component/EtatSanitaireGenerale/EtatSanitaireGenerale.component';
import { EtatSanitaireParametresMilieuComponent } from './4_Component/EtatSanitaireParametresMilieu/EtatSanitaireParametresMilieu.component';
import { EtatSanitairePhytoplanctonComponent } from './4_Component/EtatSanitairePhytoplancton/EtatSanitairePhytoplancton.component';
import { DetailsEtatSanitaireComponent } from './5_UI/Forms/DetailsEtatSanitaire/DetailsEtatSanitaire.component';
import { FrmAlertEnvironnementComponent } from './5_UI/Forms/FrmAlertEnvironnement/FrmAlertEnvironnement.component';
import { FrmAlertSanitaireComponent } from './5_UI/Forms/FrmAlertSanitaire/FrmAlertSanitaire.component';
import { FrmAvisScientificComponent } from './5_UI/Forms/FrmAvisScientific/FrmAvisScientific.component';
import { FrmCampagnesComponent } from './5_UI/Forms/FrmCampagnes/FrmCampagnes.component';
import { FrmDemandeAlerteComponent } from './5_UI/Forms/FrmDemandeAlerte/FrmDemandeAlerte.component';
import { FrmEtatSanitaireComponent } from './5_UI/Forms/FrmEtatSanitaire/FrmEtatSanitaire.component';
import { FrmPriseEnChargeComponent } from './5_UI/Forms/FrmPriseEnCharge/FrmPriseEnCharge.component';
import { FrmResultatComponent } from './5_UI/Forms/FrmResultat/FrmResultat.component';
import { FrmTraitementAvisComponent } from './5_UI/Forms/FrmTraitementAvis/FrmTraitementAvis.component';
import { OhmNgSelectComponent } from './5_UI/Forms/OhmNgSelect/OhmNgSelect.component';
import { AlerteSanitaireComponent } from './5_UI/Lists/AlerteSanitaire/AlerteSanitaire.component';
import { AlertesEnvironementComponent } from './5_UI/Lists/AlertesEnvironement/AlertesEnvironement.component';
import { AvisScientifiquesComponent } from './5_UI/Lists/AvisScientifiques/AvisScientifiques.component';
import { AvisStepperComponent } from './5_UI/Components/AvisStepperComponent/AvisStepper.component';
import { CampagnesComponent } from './5_UI/Lists/Campagnes/Campagnes.component';
import { DashboardComponent } from './5_UI/Lists/Dashboard/Dashboard.component';
import { EtatSanitaireComponent } from './5_UI/Lists/EtatSanitaire/EtatSanitaire.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor } from './core/helpers/error.interceptor';
import { FakeBackendInterceptor } from './core/helpers/fake-backend';
import { JwtInterceptor } from './core/helpers/jwt.interceptor';
import { CyptolandingComponent } from './cyptolanding/cyptolanding.component';
import { SharedModule } from './cyptolanding/shared/shared.module';
import { ExtrapagesModule } from './extrapages/extrapages.module';
import { LayoutsModule } from './layouts/layouts.module';
import { UIModule } from './shared/ui/ui.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DocumentsUtilesComponent } from './5_UI/Lists/documentsUtiles/documentsUtiles.component';
import { FrmDocumentComponent } from './5_UI/Forms/frmDocument/frmDocument.component';
import { FrmUpdateAlertEnvironnementComponent } from './5_UI/Forms/FrmUpdateAlertEnvironnement/FrmUpdateAlertEnvironnement.component';

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    CyptolandingComponent,
    AvisScientifiquesComponent,
    AvisStepperComponent,
    FrmAvisScientificComponent,
    FrmCampagnesComponent,
    AlertesEnvironementComponent,
    AlerteSanitaireComponent,
    FrmPriseEnChargeComponent,
    FrmTraitementAvisComponent,
    FrmResultatComponent,
    FrmDemandeAlerteComponent,
    CampagnesComponent,
    EtatSanitaireComponent,
    FrmEtatSanitaireComponent,
    OhmNgSelectComponent,
    DashboardComponent,
    FrmAlertSanitaireComponent,
    FrmAlertEnvironnementComponent,
    DetailsEtatSanitaireComponent,
    EtatSanitaireGeneraleComponent,
    EtatSanitaireParametresMilieuComponent,
    EtatSanitaireContamiMicroComponent,
    EtatSanitaireContamiChimiqueComponent,
    EtatSanitairePhytoplanctonComponent,
    EtatSanitaireBiotoxineEspece1Component,
    EtatSanitaireBiotoxineEspece2Component,
    DocumentsUtilesComponent,
    FrmDocumentComponent,
    FrmUpdateAlertEnvironnementComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    UIModule,
    ArchwizardModule,
    NgxMaskModule,
    NgSelectModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    ChartsModule,
    NgxChartistModule,
    NgxPaginationModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule,
    ExtrapagesModule,
    CarouselModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    NgxWebstorageModule.forRoot(),
    TooltipModule.forRoot(),
    SharedModule,
    ScrollToModule.forRoot(),
    ToastrModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    SessionManager,
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
    // LoaderService,
    // { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true },
  ],
})
export class AppModule { }