import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-patient-edit',
  standalone: true,
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.css'],
  imports: [MaterialModule, ReactiveFormsModule, RouterLink, NgIf],
})
export class PatientEditComponent implements OnInit {
  form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute, // trabajar con la información de la url
    private router: Router, // trabajar con navegación
    private patientService: PatientService // instancia de apis de paciente
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      idPatient: new FormControl(0),
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      dni: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.maxLength(150),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.route.params.subscribe((data) => {
      this.id = data['id']; // el id de la url
      this.isEdit = data['id'] != null; // devuelve true o false
      this.initForm(); // inicializar los valores de ese form
    });
  }

  initForm() {
    if (this.isEdit) {
      this.patientService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idPatient: new FormControl(data.idPatient),
          firstName: new FormControl(data.firstName, [
            Validators.required,
            Validators.minLength(3),
          ]),
          lastName: new FormControl(data.lastName, [
            Validators.required,
            Validators.minLength(3),
          ]),
          dni: new FormControl(data.dni, [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(8),
          ]),
          address: new FormControl(data.address, [
            Validators.required,
            Validators.maxLength(150),
          ]),
          phone: new FormControl(data.phone, [
            Validators.required,
            Validators.minLength(9),
          ]),
          email: new FormControl(data.email, [
            Validators.required,
            Validators.email,
          ]),
        });
      });
    }
  }

  // para enviar los datos del form
  operate() {
    const patient: Patient = new Patient();
    patient.idPatient = this.form.value['idPatient'];
    patient.firstName = this.form.value['firstName'];
    patient.lastName = this.form.value['lastName'];
    patient.dni = this.form.value['dni'];
    patient.address = this.form.value['address'];
    patient.phone = this.form.value['phone'];
    patient.email = this.form.value['email'];

    if (this.isEdit) {
      // UPDATE
      // FORMA COMÚN PERO NO LA ÓPTIMA
      this.patientService.update(this.id, patient).subscribe(() => {
        this.patientService.findAll().subscribe((data) => {
          this.patientService.setPatientChange(data); // avisando al padre
          this.patientService.setMessageChange('UPDATED'); // propagar el mensaje que hubo un cambio
        });
      });
    } else {
      // SAVE
      // FORMA ÓPTIMA
      this.patientService
        .save(patient)
        // switchMap: permite manejar subscripciones encadenadas, recupera la data proviniente del observable anterior y sobre ese resultado ir operando
        // genera un proceso de optimización de memoria
        .pipe(switchMap(() => this.patientService.findAll()))
        // operadores de error: actualmente muchas de ellas ya están deprecadas y no es la forma correcta de hacerlas aquí
        .subscribe((data) => {
          this.patientService.setPatientChange(data); // avisando al padre
          this.patientService.setMessageChange('CREATED'); // propagar el mensaje que hubo un cambio
        });
    }

    // cerrar el form, navegamos al padre: patient page
    this.router.navigate(['/pages/patient']);
  }

  // Para evitar el form.control en el html mediante form.value
  get f() {
    return this.form.controls; // me devuelve cada input destinado a él
  }
}
