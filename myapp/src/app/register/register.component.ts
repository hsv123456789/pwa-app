import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  formValid: boolean = true;
  httpClient = inject(HttpClient);
  RegisterForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    username: new FormControl(' ', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  passwordMatchValidator(
    formGroup: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmpassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  register() {
    console.log(this.RegisterForm.valid);
    console.log(this.RegisterForm.value);
    if (this.RegisterForm.valid) {
      console.log(this.RegisterForm.value);
    }
    const registerUserData = this.RegisterForm.value;
    this.httpClient
      .post('http://localhost:3000/api/user/register', registerUserData)
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (response) => {
          console.log(response);
        },
      });
  }
}
