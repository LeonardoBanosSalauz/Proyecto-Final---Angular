import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.development';

interface ILoginRequest {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private url: string = `${environment.HOST}/login`;

  constructor(private http: HttpClient, private router: Router) { }

  // postQuery(query: string, url: string) {
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  //   return this.http.post(url, query, { headers });
  // }


  // servicios de login
  login(username: string, password: string) {
    const body: ILoginRequest = { username, password };
     console.log("URL",this.url);
    console.log("body", body);
    // return this.postQuery("", this.url).pipe(map((data: any) => data));

    return this.http.post<any>(this.url, body)
  }

  isLogged() {
    const token = sessionStorage.getItem(environment.TOKEN_NAME);
    return token != null;
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
