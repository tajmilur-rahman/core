import { Component, OnInit, AfterViewInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { OrderService } from '../../../service/order.service';
import { AuthService } from '../../../service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit, AfterContentChecked {
  loading = false;
  sessionUser: any = null;
  constructor(
    private orderService: OrderService,
    private cdref: ChangeDetectorRef,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.sessionUser = this.authService.getSession();
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  ngAfterViewInit(): void {}
}
