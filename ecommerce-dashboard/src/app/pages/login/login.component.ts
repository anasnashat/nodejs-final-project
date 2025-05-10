import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  apiError: string = '';
  _authservice = inject(AuthService);
  _router = inject(Router);
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  login() {
    if (this.loginForm.valid) {
      this._authservice.login(this.loginForm.value).subscribe({
        next: (res) => {
          console.log(res);
          localStorage.setItem('token',res.token)
          this._authservice.saveUser();
          if (res.user.role === 'user') {
            this._router.navigate(['/home']);
          } else {
            this._router.navigate(['/dashboard'])
          }
        },
        error: (err) => {
          console.log(err.error.message);
          this.apiError=err.error.message;
          
        },
        complete() {
          console.log('Done Login');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  closeError() {
   this.apiError=''
 }
}
