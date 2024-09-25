import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LoginService } from '../services/login.service';
import { inject } from '@angular/core';
import { MenuService } from '../services/menu.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment.development';
import { map } from 'rxjs';
import { Menu } from '../models/menu';

// los guard ahora tienen enfoque funcional, anteriormente desde angular 14 hacia abajo era una clase
// que implemnentaba una interfaz llamada canactivate
//  Los guards en Angular se utilizan para proteger
//rutas y verificar si un usuario tiene permiso para acceder a ciertas partes de la aplicación.
export const CertGuard = (
  route: ActivatedRouteSnapshot, // capturan información de la ruta
  state: RouterStateSnapshot // captura información del estado en el que se encuentra
) => {
  const loginService = inject(LoginService); // Inyección de lógica funcional
  const menuService = inject(MenuService);
  const router = inject(Router);

  //1) VERIFICAR SI EL USUARIO ESTA LOGUEADO
  const rpta = loginService.isLogged();
  if (!rpta) {
    loginService.logout(); // si no está logueado/autenticado lo sacamos directamente
    return false;
  }
  //2) VERIFICAR SI EL TOKEN NO HA EXPIRADO
  const helper = new JwtHelperService();
  const token = sessionStorage.getItem(environment.TOKEN_NAME);

  if (!helper.isTokenExpired(token)) {
    //3) VERIFICAR SI TIENES EL ROL NECESARIO PARA ACCEDER A ESE COMPONENTE 'PAGINA'
    //url -> /pages/patient
    const url = state.url;
    const decodedToken = helper.decodeToken(token);
    const username = decodedToken.sub;

    // Se filtra el menú para ver si la URL actual (state.url) corresponde a uno de los menús
    //permitidos para ese usuario.
    //Si la URL coincide con un menú permitido, el guard retorna true y el acceso es concedido.
    //Si no coincide, el usuario es redirigido a una página de error (ej. /pages/not-403), y se retorna false.
    // los guard solo procesan respuestas controladas de un proceso asíncrono
    return menuService.getMenusByUser(username).pipe(
      map((data: Menu[]) => {
        menuService.setMenuChange(data);

        let count = 0;
        for (let m of data) {
          if (url.startsWith(m.url)) {
            count++;
            break;
          }
        }

        if (count > 0) {
          return true;
        } else {
          router.navigate(['/pages/not-403']);
          return false;
        }
      })
    );
  } else {
    loginService.logout();
    return false;
  }
};
