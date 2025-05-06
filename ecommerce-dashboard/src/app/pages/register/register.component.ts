import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  _authservice = inject(AuthService);
  _router = inject(Router);
  apiError:string=''

  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    repassword: new FormControl(),
    role: new FormControl('user'),
  });
  register() {
    if (this.registerForm.valid) {
      this._authservice.register(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this._router.navigate(["/login"]);

        },
        error: (err) => {
          console.log(err.error.message);
          this.apiError = err.error.message;
        },
        complete() {
          console.log('Done signup');
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
  closeError() {
    this.apiError = ''
  }
}
