import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./core/components/navbar/navbar.component";
import { FooterComponent } from "./core/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Jewelry Store';
  showNavbar: boolean = true;
  showFooter: boolean = true;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Only run this in the browser (not during SSR or Vite server build)
    if (isPlatformBrowser(this.platformId)) {
      const currentRoute = window.location.pathname;
      this.showNavbar = !currentRoute.includes('/dashboard');
    }
    if (isPlatformBrowser(this.platformId)) {
      const currentRoute = window.location.pathname;
      this.showFooter = !currentRoute.includes('/dashboard');
    }
  }
}
