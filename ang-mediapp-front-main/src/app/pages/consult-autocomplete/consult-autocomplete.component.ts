import { AsyncPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { map, Observable } from 'rxjs';
import { MaterialModule } from 'src/app/material/material.module';
import { Consult } from 'src/app/models/consult';
import { ConsultDetail } from 'src/app/models/consultDetail';
import { ConsultListExamDTOI } from 'src/app/models/consultListExamDTO';
import { Exam } from 'src/app/models/exam';
import { Medic } from 'src/app/models/medic';
import { Patient } from 'src/app/models/patient';
import { Specialty } from 'src/app/models/specialty';
import { ConsultService } from 'src/app/services/consult.service';
import { ExamService } from 'src/app/services/exam.service';
import { MedicService } from 'src/app/services/medic.service';
import { PatientService } from 'src/app/services/patient.service';
import { SpecialtyService } from 'src/app/services/specialty.service';

@Component({
  selector: 'app-consult-autocomplete',
  standalone: true,
  templateUrl: './consult-autocomplete.component.html',
  styleUrls: ['./consult-autocomplete.component.css'],
  imports: [MaterialModule, NgFor, ReactiveFormsModule, AsyncPipe],
})
export class ConsultAutocompleteComponent implements OnInit {
  // atributos
  form: FormGroup;
  patients$: Observable<Patient[]>;
  medicsFiltered$: Observable<Medic[]>;
  medics: Medic[];
  specialties: Specialty[];
  exams: Exam[];
  medicControl: FormControl = new FormControl('', [Validators.required]);
  details: ConsultDetail[] = [];
  examsSelected: Exam[] = [];
  minDate: Date = new Date(); // definir la fecha mínima con la que empieza el calendario

  // constructor
  constructor(
    private patientService: PatientService,
    private medicService: MedicService,
    private specialtyService: SpecialtyService,
    private examService: ExamService,
    private consultService: ConsultService,
    private _snackBar: MatSnackBar
  ) {}

  // métodos
  ngOnInit(): void {
    // incializar la instancia del form
    this.form = new FormGroup({
      patient: new FormControl([Validators.required]),
      medic: this.medicControl,
      specialty: new FormControl([Validators.required]),
      consultDate: new FormControl(new Date(), [Validators.required]),
      diagnosis: new FormControl('', [Validators.required]),
      treatment: new FormControl('', [Validators.required]),
      exam: new FormControl(),
    });

    // cargar la información de las listas
    this.loadInitialData();
  }

  // cargar la información que necesito
  loadInitialData() {
    this.patients$ = this.patientService.findAll();
    this.medicService.findAll().subscribe((data) => (this.medics = data));
    this.specialtyService
      .findAll()
      .subscribe((data) => (this.specialties = data));
    this.examService.findAll().subscribe((data) => (this.exams = data));
    // reconocimiento de cambios mediante el filtro de médicos
    this.medicsFiltered$ = this.medicControl.valueChanges.pipe(
      map((val) => this.filterMedics(val))
    );
  }

  // filtrar los médicos
  filterMedics(val: any) {
    // si tenemos medic como un objeto
    if (val?.idMedic > 0) {
      // Definir un filtro para devolver una lista que cumpla con al menos una de las sgtes.condiciones
      return this.medics.filter(
        (el) =>
          el.primaryName
            .toLowerCase()
            .includes(val.primaryName.toLowerCase()) ||
          el.surname.toLowerCase().includes(val.surname.toLowerCase()) ||
          el.codMedic.includes(val.codMedic)
      );
    } else {
      // como cadena
      return this.medics.filter(
        (el) =>
          el.primaryName.toLowerCase().includes(val?.toLowerCase()) ||
          el.surname.toLowerCase().includes(val?.toLowerCase()) ||
          el.codMedic.includes(val?.codMedic)
      );
    }
  }

  // mostrar la info del médico
  showMedic(val: any) {
    return val ? `${val.primaryName} ${val.surname}` : val;
  }

  // agregarle la información del detalle de la consulta
  addDetail() {
    const det = new ConsultDetail();
    det.diagnosis = this.form.value['diagnosis'];
    det.treatment = this.form.value['treatment'];

    this.details.push(det);
  }

  // remover un detalle de consulta
  removeDetail(index: number) {
    this.details.splice(index, 1);
  }

  // agregar un examen
  addExam() {
    if (this.form.value['exam'] != null) {
      this.examsSelected.push(this.form.value['exam']);
    } else {
      this._snackBar.open('Please select an exam', 'INFO', { duration: 2000 });
    }
  }

  // guardar la consulta
  save() {
    if (this.form.invalid) {
      return;
    }
    const consult = new Consult();
    consult.patient = this.form.value['patient'];
    consult.medic = this.form.value['medic'];
    consult.specialty = this.form.value['specialty'];
    consult.details = this.details;
    consult.numConsult = 'C1';

    // darle formato al valor capturado del form para emitirlo como lo necesita el backend
    consult.consultDate = moment(this.form.value['consultDate']).format(
      'YYYY-MM-DDTHH:mm:ss'
    );

    // asociarle los exámenes
    const dto: ConsultListExamDTOI = {
      consult: consult,
      lstExam: this.examsSelected,
    };

    this.consultService.saveTransactional(dto).subscribe(() => {
      this._snackBar.open('CREATED!', 'INFO', { duration: 2000 });

      setTimeout(() => {
        this.cleanControls();
      }, 2000);
    });
  }

  // limpiar los campos del form.
  cleanControls() {
    this.form.reset();
    this.medicControl.reset();
    this.details = [];
    this.examsSelected = [];
    this.form.patchValue({
      // para decirle que se restrablezca a un cierto valor una vez reseteado el form
      consultDate: new Date(),
    });
  }

  getDate(e: any) {
    console.log(e);
  }
}
