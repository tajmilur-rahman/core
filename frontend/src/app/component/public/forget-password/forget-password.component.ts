import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  loading = false;
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    ) {}

  ngOnInit(): void {}

  submit(): void {
    if (!this.form.valid) {
      return;
    }

    const data = this.form.getRawValue();

    this.loading = true;
    this.authService.forgetPassword(data).subscribe(response => {
      this.snackBar.open('Password reset mail sent', '', {
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
