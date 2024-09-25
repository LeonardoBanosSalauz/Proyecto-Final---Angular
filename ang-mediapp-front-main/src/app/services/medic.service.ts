import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Medic } from '../models/medic';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class MedicService extends GenericService<Medic> {
  //private url: string = `${environment.HOST}/Medics`;
  private medicChange: Subject<Medic[]> = new Subject<Medic[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor(protected override http: HttpClient) {
    super(http, `${environment.HOST}/medics`);
  }

  /*findAll() {
    return this.http.get<Medic[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<Medic>(`${this.url}/${id}`);
  }

  save(Medic: Medic) {
    return this.http.post(this.url, Medic);
  }

  update(id: number, Medic: Medic) {
    return this.http.put(`${this.url}/${id}`, Medic);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }*/

  // SERVICIOS DE NOTIFICACIÓN REACTIVA: RXJS
  setmedicChange(data: Medic[]) {
    this.medicChange.next(data); // next: recibe los cambios que quieras expresar y lo propaga
  }

  getmedicChange() {
    return this.medicChange.asObservable(); // recupero el contenido notificado
  }

  setMessageChange(data: string) {
    this.messageChange.next(data); // next: recibe los cambios que quieras expresar y lo propaga
  }

  getMessageChange() {
    return this.messageChange.asObservable(); // recupero el contenido notificado
  }
}
