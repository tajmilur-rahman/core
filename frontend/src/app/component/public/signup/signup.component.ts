import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  loading = false;
  queryParams: any;
  signupForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    phone_number: new FormControl('', [Validators.required]),
    role_id: new FormControl('', [Validators.required]),
    company_name: new FormControl(''),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
    });

    if (this.queryParams.messageType && this.queryParams.message) {
      this.snackBar.open(this.queryParams.message, '', {
        duration: 2000,
        panelClass: [this.queryParams.messageType]
      });
    }
  }

  submit(): void {
    if (!this.signupForm.valid) {
      return;
    }

    this.loading = true;
    this.authService.createUser(this.signupForm.getRawValue()).subscribe(response => {
      if (this.queryParams.returnUrl) {
        window.location.href = this.queryParams.returnUrl;
      } else {
        this.snackBar.open('An email sent to you for verification', '', {
          duration: 5000,
          panelClass: ['success']
        });
        this.router.navigate(['public', 'login']);
      }
    }, error => {
      this.loading = false;
      this.snackBar.open(error.error.message, '', {
        duration: 1000,
        panelClass: ['error']
      });
    }, () => {
      this.loading = false;
    });
  }
}
