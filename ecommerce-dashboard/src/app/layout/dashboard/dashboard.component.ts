import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,RouterOutlet,RouterLink,RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  isSmallScreenFlag: boolean = false;
  sidebarOpen: boolean = false; // Flag to control sidebar visibility

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Add resize event listener when in browser environment
      window.addEventListener('resize', this.onResize.bind(this));
      this.checkIfSmallScreen();
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Remove event listener to avoid memory leaks
      window.removeEventListener('resize', this.onResize.bind(this));
    }
  }

  // Method to check if the screen width is small
  checkIfSmallScreen(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isSmallScreenFlag = window.innerWidth <= 768;
    }
  }

  // Handle resize event
  onResize(event: Event): void {
    this.checkIfSmallScreen();
  }

  // Toggle the sidebar visibility
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // Getter method for accessing the screen size flag
  get isSmallScreen(): boolean {
    return this.isSmallScreenFlag;
  }
}
