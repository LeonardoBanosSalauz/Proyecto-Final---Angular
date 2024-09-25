import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { CustomDateAdapter } from './custom-adapter';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatDividerModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatListModule,
    MatNativeDateModule,
    MatCardModule,
    MatStepperModule,
    MatGridListModule,
    MatTabsModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, // definir el locale del calendario en un cierto idioma: español
    { provide: DateAdapter, useClass: CustomDateAdapter }, // proveer la lógica personalizada al calendario
  ],
})
export class MaterialModule {}
