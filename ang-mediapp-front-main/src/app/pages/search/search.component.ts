import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from 'src/app/material/material.module';
import { Consult } from 'src/app/models/consult';
import { ConsultService } from 'src/app/services/consult.service';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { DatePipe, LowerCasePipe, UpperCasePipe } from '@angular/common';
import { MatTabGroup } from '@angular/material/tabs';
import { FilterConsultDTO } from 'src/app/models/FilterConsultDTO';
import * as moment from 'moment';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    UpperCasePipe,
    LowerCasePipe,
    DatePipe,
  ],
})
export class SearchComponent implements OnInit {
  form: FormGroup;

  dataSource: MatTableDataSource<Consult>;
  displayedColumns = ['patient', 'medic', 'specialty', 'date', 'actions'];

  @ViewChild('tab') tabGroup: MatTabGroup;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private consultService: ConsultService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      dni: new FormControl(),
      fullname: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
    });
  }

  createTable(data: Consult[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  search() {
    // OPTION 1
    if (this.tabGroup.selectedIndex == 0) {
      const dni = this.form.value['dni'];
      const fullname: string = this.form.value['fullname']?.toLowerCase();

      const filterData = new FilterConsultDTO(dni, fullname);

      this.consultService.searchByOthers(filterData).subscribe((data) => {
        this.createTable(data);
      });
    } else {
      // OPTION 2
      let date1 = this.form.value['startDate'];
      let date2 = this.form.value['endDate'];

      date1 = moment(date1).format('YYYY-MM-DDTHH:mm:ss');
      date2 = moment(date2).format('YYYY-MM-DDTHH:mm:ss');

      this.consultService.searchByDates(date1, date2).subscribe((data) => {
        this.createTable(data);
      });
    }
  }

  viewDetails(consult: Consult) {
    this._dialog.open(SearchDialogComponent, {
      width: '750px',
      data: consult,
    });
  }
}
