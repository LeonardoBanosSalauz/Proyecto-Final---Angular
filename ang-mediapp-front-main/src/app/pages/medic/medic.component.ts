import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Medic } from 'src/app/models/medic';
import { MedicService } from 'src/app/services/medic.service';
import { MedicDialogComponent } from './medic-dialog/medic-dialog.component';
import { switchMap } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-medic',
  standalone: true,
  templateUrl: './medic.component.html',
  styleUrls: ['./medic.component.css'],
  imports: [MaterialModule],
})
export class MedicComponent {
  dataSource: MatTableDataSource<Medic>;
  displayedColumns: string[] = [
    'idMedic',
    'primaryName',
    'surname',
    'codMed',
    'actions',
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private medicService: MedicService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.medicService.findAll().subscribe((data) => {
      this.createTable(data);
    });

    // reflejar los cambios reactivos
    this.medicService.getmedicChange().subscribe((data) => {
      this.createTable(data);
    });

    this.medicService.getMessageChange().subscribe((data) => {
      this._snackBar.open(data, 'INFO', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    });
  }

  createTable(data: Medic[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  openDialog(medic?: Medic) {
    // pasar la referencia de la data
    this._dialog.open(MedicDialogComponent, {
      width: '350px',
      data: medic,
      disableClose: true,
    });
  }

  delete(id: number) {
    this.medicService
      .delete(id)
      .pipe(switchMap(() => this.medicService.findAll()))
      .subscribe((data) => {
        this.medicService.setmedicChange(data);
        this.medicService.setMessageChange('DELETED!');
      });
  }
}
