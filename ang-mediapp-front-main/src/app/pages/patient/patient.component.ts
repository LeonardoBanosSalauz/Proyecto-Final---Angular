import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet } from '@angular/router';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Patient } from 'src/app/models/patient';
import { PatientService } from 'src/app/services/patient.service';


@Component({
  selector: 'app-patient',
  standalone: true,
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
  imports: [MaterialModule, RouterLink, RouterOutlet],
})
export class PatientComponent implements OnInit {
  dataSource: MatTableDataSource<Patient>;
  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'dni',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  totalElements: number = 0;

  constructor(
    private patientService: PatientService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    /*this.patientService.findAll().subscribe((data) => {
      this.createTable(data);
    });*/

    this.patientService.listPageable(0, 2).subscribe((data) => {
      this.totalElements = data.totalElements;
      this.createTable(data.content);
    });

    // reflejar los cambios reactivos
    this.patientService.getPatientChange().subscribe((data) => {
      this.createTable(data);
    });

    this.patientService.getMessageChange().subscribe((data) => {
      this._snackBar.open(data, 'INFO', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    });



  }

 
  createTable(data: Patient[]) {
    // Se crea una nueva instancia de MatTableDataSource utilizando los datos proporcionados 
    // (una lista de pacientes), que proporciona funcionalidades de paginación y ordenación 
    // para la tabla de datos.
    this.dataSource = new MatTableDataSource(data);
  
    // Se asigna el paginador a la fuente de datos, permitiendo la paginación de los resultados 
    // en la tabla, mejorando la experiencia del usuario al navegar por grandes conjuntos de datos.
    this.dataSource.paginator = this.paginator;
  
    // Se asigna el ordenamiento a la fuente de datos, habilitando la posibilidad de ordenar 
    // los datos en la tabla según diferentes columnas.
    this.dataSource.sort = this.sort;
  
    // Se define un accessor de datos de ordenamiento personalizado, que determina cómo 
    // se deben ordenar los elementos basándose en la propiedad especificada.
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'id':
          // Si la propiedad es 'id', se devuelve el identificador del paciente.
          return item.idPatient;
        case 'firstName':
          // Si la propiedad es 'firstName', se devuelve el primer nombre del paciente.
          return item.firstName;
        case 'lastName':
          // Si la propiedad es 'lastName', se devuelve el apellido del paciente.
          return item.lastName;
        case 'dni':
          // Si la propiedad es 'dni', se devuelve el número de identificación del paciente.
          return item.dni;
        default:
          // Para cualquier otra propiedad, se devuelve el valor correspondiente del objeto 'item'.
          return item[property];
      }
    };
  
    // Se establece la columna activa por defecto para el ordenamiento en 'id', 'firstName', 
    // 'lastName', 'dni', y 'actions', lo que permite que estas columnas sean ordenadas 
    // inicialmente al cargar la tabla.
    this.sort.active = 'id'; 
    this.sort.active = 'firstName'; 
    this.sort.active = 'lastName'; 
    this.sort.active = 'dni'; 
    this.sort.active = 'actions';
  
    // Se establece la dirección de ordenamiento por defecto en 'desc', lo que indica que 
    // los resultados se mostrarán en orden descendente.
    this.sort.direction = 'desc';
  }

  delete(idPatient: number) {
    this.patientService
      .delete(idPatient)
      .pipe(switchMap(() => this.patientService.findAll()))
      .subscribe((data) => {
        this.patientService.setPatientChange(data);
        this.patientService.setMessageChange('DELETED');
      });
  }

  applyFilter(e: Event) {
    const inputElement = e.target as HTMLInputElement;
    this.dataSource.filter = inputElement.value.trim();
  }

  showMore(e: any) {
    this.patientService
      .listPageable(e.pageIndex, e.pageSize)
      .subscribe((data) => {
        this.totalElements = data.totalElements;
        this.createTable(data.content);
      });
  }
}
