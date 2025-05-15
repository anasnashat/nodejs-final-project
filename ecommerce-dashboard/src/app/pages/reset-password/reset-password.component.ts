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
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  apiError: string = '';
  _authservice = inject(AuthService);
  _router = inject(Router);

  resetPasswordForm: FormGroup = new FormGroup({
    code: new FormControl('', Validators.required),
    newPassword: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
    repassword: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
  });
  resetPassword() {
    if (this.resetPasswordForm.valid) {
      this._authservice.resetPassword(this.resetPasswordForm.value).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {
          console.log(err.error.message);
          this.apiError = err.error.message;
        },
        complete() {
          console.log('Done resetPassword');
        },
      });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }
  closeError() {
    this.apiError = '';
  }
}
