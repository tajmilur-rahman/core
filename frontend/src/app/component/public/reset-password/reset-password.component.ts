import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  loading = false;
  form: FormGroup = new FormGroup({
    new_password: new FormControl('', [Validators.required]),
    confirm_password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    ) {}

  ngOnInit(): void {}

  submit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const passwordVerificationCode = this.route.snapshot.paramMap.get('password_verification_code');
    if (!id || !passwordVerificationCode) {
      this.snackBar.open('ID and Password Verification code needed', '', {
        duration: 2000,
        panelClass: ['error']
      });
      return;
    }

    if (!this.form.valid) {
      return;
    }

    const data = this.form.getRawValue();
    data.password_verification_code = passwordVerificationCode;

    this.loading = true;
    this.authService.resetPassword(data, +id).subscribe(response => {
      this.snackBar.open('Password reset successfully', '', {
        duration: 5000,
        panelClass: ['success']
      });
      this.router.navigate(['public', 'login']);
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
