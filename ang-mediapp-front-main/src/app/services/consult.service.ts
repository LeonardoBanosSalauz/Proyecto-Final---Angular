import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ConsultListExamDTOI } from '../models/consultListExamDTO';
import { FilterConsultDTO } from '../models/FilterConsultDTO';
import { Consult } from '../models/consult';

@Injectable({
  providedIn: 'root',
})
export class ConsultService {
  private url: string = `${environment.HOST}/consults`;

  constructor(private http: HttpClient) {}

  saveTransactional(dto: ConsultListExamDTOI) {
    return this.http.post(this.url, dto);
  }

  searchByOthers(dto: FilterConsultDTO) {
    return this.http.post<Consult[]>(`${this.url}/search/others`, dto);
  }

  searchByDates(date1: string, date2: string) {
    /*const params: HttpParams = new HttpParams();
    params.set('date1', date1);
    params.set('date2', date2);

    return this.http.get<Consult[]>(`${this.url}/search/dates`, {
      params: params,
    });*/

    return this.http.get<Consult[]>(
      `${this.url}/search/dates?date1=${date1}&date2=${date2}`
    );
  }

  getExamsByIdConsult(idConsult: number) {
    return this.http.get<any>(`${environment.HOST}/consultexams/${idConsult}`);
  }

  // REPORTS
  callProcedureOrFunction() {
    return this.http.get<any>(`${this.url}/callProcedureNative`);
  }

  // blob: es un tipo especifico para procesamiento óptimo de archivos: imágenes, pdfs, excel, etc...
  generateReport() {
    return this.http.get(`${this.url}/generateReport`, {
      responseType: 'blob',
    });
  }

  // Files, images
  saveFile(data: File) {
    const formData: FormData = new FormData();
    formData.append('file', data);

    return this.http.post(`${this.url}/saveFile`, formData);
  }

  readFile(id: number) {
    return this.http.get(`${this.url}/readFile/${id}`, {
      responseType: 'blob',
    });
  }
}
