import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MaterialModule } from 'src/app/material/material.module';
import { Menu } from 'src/app/models/menu';
import { LoginService } from 'src/app/services/login.service';
import { MenuService } from 'src/app/services/menu.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  imports: [
    MaterialModule,
    RouterLink,
    RouterLinkActive,
    NgIf,
    RouterOutlet,
    NgFor,
  ],
})
export class LayoutComponent {
  menus: Menu[];

  constructor(
    private loginService: LoginService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.menuService.getMenuChange().subscribe((data) => (this.menus = data));
  }

  logout() {
    this.loginService.logout();
  }
}
