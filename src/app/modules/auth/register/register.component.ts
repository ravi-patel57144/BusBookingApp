import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastrService: NbToastrService
  ) {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  register(): void {
    if (this.registrationForm.valid) {
      const userDetails = {
        ...this.registrationForm.value,
        createdAt: new Date(),
        modifiedAt: new Date(),
        isDeleted: false
      };

      this.userService.register(userDetails).subscribe(
        (success) => {
          if (success) {
            this.toastrService.success('Registration Successful', 'Nebular Toastr');
            this.router.navigate(['/login']);
          } else {
            this.toastrService.warning('Email already exists', 'Registration Failed');
          }
        },
        (error) => {
          this.toastrService.danger('Registration Failed', 'Nebular Toastr');
          console.error('Registration Error:', error);
        }
      );
    } else {
      Object.values(this.registrationForm.controls).forEach(control => {
        control.markAsTouched();
      });
      this.toastrService.warning('Please fill out all required fields.', 'Validation Error');
    }
  }
}
