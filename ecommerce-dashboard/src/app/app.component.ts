import { Component,OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from "./layout/dashboard/dashboard.component";
import { NavbarComponent } from "./core/components/navbar/navbar.component";
import { FooterComponent } from "./core/footer/footer.component";
import { on } from 'events';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'ecommerce-dashboard';
  showNavbar: boolean = true;

  ngOnInit(): void {
    // This will control the navbar visibility
    const currentRoute = window.location.pathname;

    // Check if we are on the admin page or any other page you want to exclude the navbar
    if (currentRoute.includes('/dashboard')) {
      this.showNavbar = false;
    } else {
      this.showNavbar = true;
    }
  }
}
