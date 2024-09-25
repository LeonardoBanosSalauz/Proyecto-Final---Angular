import { Routes } from '@angular/router';
import { PatientComponent } from './patient/patient.component';
import { PatientEditComponent } from './patient/patient-edit/patient-edit.component';
import { MedicComponent } from './medic/medic.component';
import { ExamComponent } from './exam/exam/exam.component';
import { ExamEditComponent } from './exam/exam-edit/exam-edit.component';
import { SpecialtyComponent } from './specialty/specialty.component';
import { SpecialtyEditComponent } from './specialty/specialty-edit/specialty-edit.component';
import { ConsultAutocompleteComponent } from './consult-autocomplete/consult-autocomplete.component';
import { ConsultWizardComponent } from './consult-wizard/consult-wizard.component';
import { SearchComponent } from './search/search.component';
import { ReportComponent } from './report/report.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CertGuard } from '../guards/cert.guard';
import { Not403Component } from './not403/not403.component';

export const PagesRoutes: Routes = [
  {
    path: 'patient',
    component: PatientComponent,
    children: [
      {
        path: 'new',
        component: PatientEditComponent,
      },
      {
        path: 'edit/:id',
        component: PatientEditComponent,
      },
    ],
    canActivate: [CertGuard],
  },
  { path: 'medic', component: MedicComponent, canActivate: [CertGuard] },
  {
    path: 'exam',
    component: ExamComponent,
    children: [
      { path: 'new', component: ExamEditComponent },
      { path: 'edit/:id', component: ExamEditComponent },
    ],
    canActivate: [CertGuard],
  },
  {path: 'specialty', component: SpecialtyComponent,
    children: [
      { path: 'new', component: SpecialtyEditComponent },
      { path: 'edit/:id', component: SpecialtyEditComponent },
    ],
    canActivate: [CertGuard],
  },
  {path: 'consult-autocomplete',component: ConsultAutocompleteComponent, canActivate: [CertGuard],},
  {path: 'consult-wizard', component: ConsultWizardComponent,canActivate: [CertGuard],},
  { path: 'search', component: SearchComponent, canActivate: [CertGuard] },
  { path: 'report', component: ReportComponent, canActivate: [CertGuard] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [CertGuard],
  },
  { path: 'not-403', component: Not403Component },
];
