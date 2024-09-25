import { MenuService } from './../../services/menu.service';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MaterialModule } from 'src/app/material/material.module';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [MaterialModule],
})
export class DashboardComponent implements OnInit {

  // constructor(private menuService: MenuService) {}

  // ngOnInit(): void {
  //   this.menuService.getMenusByUser(this.username).subscribe((data) => {
  //     this.menuService.setMenuChange(data);
  //   });
  // }
  username: string;
  
  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
      const helper = new JwtHelperService(); //instancia para manipular el token
      const decodeToken = helper.decodeToken(
        //decodifica el payload y lo leo del session
        sessionStorage.getItem(environment.TOKEN_NAME)
      );
      console.log(decodeToken);
      this.username = decodeToken.sub;

      this.menuService.getMenusByUser(this.username).subscribe((data) =>{
        this.menuService.setMenuChange(data);
      })
  }
}
