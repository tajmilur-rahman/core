import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading = false;
  queryParams: any;
  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
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
    if (!this.loginForm.valid) {
      return;
    }

    this.loading = true;
    this.authService.loginUser(this.loginForm.controls.username.value, this.loginForm.controls.password.value).subscribe(response => {
      this.authService.setSession(response);

      if (this.queryParams.returnUrl) {
        window.location.href = this.queryParams.returnUrl;
      } else {
        this.router.navigate(['private', 'dashboard']);
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
