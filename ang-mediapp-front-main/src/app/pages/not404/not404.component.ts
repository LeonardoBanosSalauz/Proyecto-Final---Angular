import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'app-not404',
  standalone: true,
  templateUrl: './not404.component.html',
  styleUrls: ['./not404.component.css'],
  imports: [MaterialModule, RouterLink]
})
export class Not404Component {

}
