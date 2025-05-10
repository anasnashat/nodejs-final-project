import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  _authservice=inject(AuthService)
  isLogin:boolean=false;
  scrolled = false;
  isDarkMode = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const dark = localStorage.getItem('darkMode') === 'true';
      this.isDarkMode = dark;
      document.body.classList.toggle('dark-mode', dark);
    }
    this._authservice.userInfo.subscribe({
      next:(res)=>{
        this.isLogin=res?true:false;
        console.log(res);
        console.log(this.isLogin)
      },
      error:(err)=>{
        console.log(err);
      },complete(){
        console.log('done');
      }
    })
  }
  
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('darkMode', this.isDarkMode.toString());
    }
  }
  
  logout(){
    if(confirm("Are You Sure you Want to Logout ")){
      localStorage.removeItem('token');
      this.isLogin=false;
    }
  }
}
