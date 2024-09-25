import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Patient } from '../models/patient';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class PatientService extends GenericService<Patient> {
  //private url: string = `${environment.HOST}/patients`;
  private patientChange: Subject<Patient[]> = new Subject<Patient[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/patients`);
  }

  listPageable(p: number, s: number) {
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  /*findAll() {
    return this.http.get<Patient[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<Patient>(`${this.url}/${id}`);
  }

  save(patient: Patient) {
    return this.http.post(this.url, patient);
  }

  update(id: number, patient: Patient) {
    return this.http.put(`${this.url}/${id}`, patient);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }*/

  // SERVICIOS DE NOTIFICACIÓN REACTIVA: RXJS
  setPatientChange(data: Patient[]) {
    this.patientChange.next(data); // next: recibe los cambios que quieras expresar y lo propaga
  }

  getPatientChange() {
    return this.patientChange.asObservable(); // recupero el contenido notificado
  }

  setMessageChange(data: string) {
    this.messageChange.next(data); // next: recibe los cambios que quieras expresar y lo propaga
  }

  getMessageChange() {
    return this.messageChange.asObservable(); // recupero el contenido notificado
  }
}
