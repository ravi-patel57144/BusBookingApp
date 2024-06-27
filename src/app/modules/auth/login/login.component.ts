import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastrService: NbToastrService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;

      // Now, use email and password in your userService.login() method
      this.userService.login(email, password).subscribe(
        loggedIn => {
          if (loggedIn) {
            // Show success message and redirect to /booking
            this.toastrService.success('Login Successful', 'Success');
            this.router.navigate(['/booking']);
          } else {
            // Show error message for invalid credentials
            this.toastrService.danger('Invalid email or password', 'Error');
          }
        },
        error => {
          console.error('Login error:', error);
          this.toastrService.danger('Login failed. Please try again later.', 'Error');
        }
      );
    } else {
      // Handle form validation errors if any
      this.toastrService.warning('Please fill out the form correctly', 'Warning');
    }
  }

}
