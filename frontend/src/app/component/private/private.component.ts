import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss']
})
export class PrivateComponent implements OnInit {
  opened = false;
  sessionUser: any = null;
  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.sessionUser = this.authService.getSession();
  }

  logout(): void {
    this.authService.removeSession();
    this.router.navigate(['']);
  }

  hideSideNav() {
    this.opened = false;
  }

}
