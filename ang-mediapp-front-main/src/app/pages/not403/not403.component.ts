import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MaterialModule } from 'src/app/material/material.module';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-not403',
  standalone: true,
  templateUrl: './not403.component.html',
  styleUrls: ['./not403.component.css'],
  imports: [MaterialModule, RouterLink]
})
export class Not403Component implements OnInit{

  username: string;

  ngOnInit(): void {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.username = decodedToken.sub;
  }
}
