import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { decl } from 'postcss';
declare var bootstrap:any;
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})

export class RegisterComponent {
  
  _authservice = inject(AuthService);
  _router = inject(Router);
  apiError: string = '';
  selectedImage: File | null = null;

 

  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    repassword: new FormControl('',[Validators.required,Validators.minLength(6)]),
  
    role: new FormControl('user'),
  });
  register() {
     const formData = new FormData();

     formData.append('name', this.registerForm.value.name);
     formData.append('email', this.registerForm.value.email);
     formData.append('password', this.registerForm.value.password);
     formData.append('repassword', this.registerForm.value.repassword);
     formData.append('role', this.registerForm.value.role);

     if (this.selectedImage) {
       formData.append('profileImage', this.selectedImage);
     }
     if (this.registerForm.valid) {
      this._authservice.register(formData).subscribe({
        next: (res) => {
         
          this._router.navigate(['/login']);
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
    this.apiError = '';
  }
  onImageSelect(event: any) {
    this.selectedImage = event.target.files[0];
  }
}
