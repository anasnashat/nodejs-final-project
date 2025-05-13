import { Component,HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,RouterOutlet,RouterLink,RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  sidebarCollapsed = true;
  isSmallScreen = false;

  ngOnInit(): void {
    this.checkScreenSize();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 992; // Bootstrap's lg breakpoint
    if (!this.isSmallScreen) {
      this.sidebarCollapsed = false;
    }
  }
}
