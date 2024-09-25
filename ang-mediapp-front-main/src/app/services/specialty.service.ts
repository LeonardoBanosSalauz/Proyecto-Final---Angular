import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Specialty } from '../models/specialty';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class SpecialtyService extends GenericService<Specialty> {
  //private url: string = `${environment.HOST}/Specialtys`;
  private SpecialtyChange: Subject<Specialty[]> = new Subject<Specialty[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/specialtys`);
  }

  /*findAll() {
    return this.http.get<Specialty[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<Specialty>(`${this.url}/${id}`);
  }

  save(Specialty: Specialty) {
    return this.http.post(this.url, Specialty);
  }

  update(id: number, Specialty: Specialty) {
    return this.http.put(`${this.url}/${id}`, Specialty);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }*/

  // SERVICIOS DE NOTIFICACIÓN REACTIVA: RXJS
  setSpecialtyChange(data: Specialty[]) {
    this.SpecialtyChange.next(data); // next: recibe los cambios que quieras expresar y lo propaga
  }

  getSpecialtyChange() {
    return this.SpecialtyChange.asObservable(); // recupero el contenido notificado
  }

  setMessageChange(data: string) {
    this.messageChange.next(data); // next: recibe los cambios que quieras expresar y lo propaga
  }

  getMessageChange() {
    return this.messageChange.asObservable(); // recupero el contenido notificado
  }
}
