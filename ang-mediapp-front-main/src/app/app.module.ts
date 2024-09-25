import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { LoginComponent } from './login/login.component';
// import { PatientComponent } from './pages/patient/patient.component';
// import { MedicComponent } from './pages/medic/medic.component';
// import { PatientEditComponent } from './pages/patient/patient-edit/patient-edit.component';
import { MaterialModule } from './material/material.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// import { ReportComponent } from './pages/report/report.component';
// import { SearchComponent } from './pages/search/search.component';
// import { SearchDialogComponent } from './pages/search/search-dialog/search-dialog.component';
// import { ConsultAutocompleteComponent } from './pages/consult-autocomplete/consult-autocomplete.component';
// import { SpecialtyEditComponent } from './pages/specialty/specialty-edit/specialty-edit.component';
// import { SpecialtyComponent } from './pages/specialty/specialty.component';
// import { LayoutComponent } from './pages/layout/layout.component';
// import { ExamEditComponent } from './pages/exam/exam-edit/exam-edit.component';
// import { ExamComponent } from './pages/exam/exam/exam.component';
// import { MedicDialogComponent } from './pages/medic/medic-dialog/medic-dialog.component';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment.development';
import { ServerErrorsInterceptor } from './interceptor/server-errors.interceptor';

export function tokenGetter() {
  return sessionStorage.getItem(environment.TOKEN_NAME);
}

@NgModule({
  declarations: [
    AppComponent,
   // LoginComponent,
   // ReportComponent,
   // SearchComponent,
   // SearchDialogComponent,
   // ConsultAutocompleteComponent,
   // SpecialtyEditComponent,
   // SpecialtyComponent,
   // LayoutComponent,
   // ExamEditComponent,
   // ExamComponent,
   // MedicDialogComponent,
   // PatientComponent,
   // MedicComponent,
   // PatientEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    JwtModule.forRoot({
      config: {
            tokenGetter: tokenGetter,
            allowedDomains: ['http://10.20.0.11:8080'],
            disallowedRoutes: ['http://10.20.0.11:8080/login/forget'],
        },
    }),
],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true, //para habilitar si es que hay mas cadenas de intercepción
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
