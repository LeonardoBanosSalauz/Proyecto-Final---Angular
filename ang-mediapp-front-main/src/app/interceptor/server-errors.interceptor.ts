
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { retry, tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ServerErrorsInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar, private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // next: HttpHandler: Es un manejador que se utiliza para pasar la solicitud
    //al siguiente interceptor o enviarla al servidor.
    return (
      next.handle(request).pipe(retry(environment.RETRY)) // con esto puedo controlar la petición
        //tap: Esta función permite realizar efectos secundarios,
        //en este caso, verificar si la respuesta del servidor contiene un error.
        .pipe(
          tap((event) => {
            if (event instanceof HttpResponse) {
              if (
                event.body &&
                event.body.error === true &&
                event.body.errorMessage
              ) {
                throw new Error(event.body.errorMessage);
              }
              /*else{
                        this.snackBar.open("EXITO", 'AVISO', { duration: 5000 });
                    }*/
            }
          })
        )
        .pipe(catchError((err) => {
            if (err.status === 400) {
              //console.log(err);
              this.snackBar.open(err.message, 'ERROR 400', { duration: 5000 });
            } else if (err.status === 404) {
              this.snackBar.open('No existe el recurso', 'ERROR 404', {
                duration: 5000,
              });
            } else if (err.status === 403 || err.status === 401) {
              console.log(err);
              this.snackBar.open(err.error.message, 'ERROR 403', {
                duration: 5000,
              });
              //sessionStorage.clear();
              //this.router.navigate(['/login']);
            } else if (err.status === 500) {
              this.snackBar.open(err.error.message, 'ERROR 500', {
                duration: 5000,
              });
            } else {
              this.snackBar.open(err.error.message, 'ERROR', {
                duration: 5000,
              });
            }
            //return EMPTY: Devuelve un observable vacío, lo que efectivamente cancela la propagación del error.
            return EMPTY;
          })
        )
    );
  }
}



// import {
//   HttpEvent,
//   HttpHandler,
//   HttpInterceptor,
//   HttpRequest
// } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { Router } from '@angular/router';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class ServerErrorsInterceptor implements HttpInterceptor {
//   constructor(private snackBar: MatSnackBar, private router: Router) {}
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     throw new Error('Method not implemented.');
//   }


// }
