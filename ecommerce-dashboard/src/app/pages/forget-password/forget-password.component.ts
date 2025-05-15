import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule,RouterLink],
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css',
})
export class ForgetPasswordComponent {
  _authservice = inject(AuthService);
  _router = inject(Router);
  forgetPasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    
  });

  forgetPassword() {
    if (this.forgetPasswordForm.valid) {
      this._authservice.forgetPassword(this.forgetPasswordForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this._router.navigate(['/reset-password'])
        },
        error: (err) => {
          console.log(err.error.message);
        },
        complete() {
          console.log('Done Forget Password');
        },
      });
    } else {
      this.forgetPasswordForm.markAllAsTouched();
    }
  }
}
