import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import {  ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-navbar',
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  _authservice=inject(AuthService)
  isLogin:boolean=false;
//   scrolled = false;
//   isDarkMode = false;

// toggleDarkMode() {
//   this.isDarkMode = !this.isDarkMode;
//   localStorage.setItem('darkMode', this.isDarkMode.toString());
//   document.body.classList.toggle('dark-mode', this.isDarkMode);
// }



  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   this.scrolled = window.scrollY > 50;
  // }

  ngOnInit(): void {
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
  
  logout(){
    if(confirm("Are You Sure you Want to Logout ")){
      localStorage.removeItem('token');
      this.isLogin=false;
    }
  }
}
