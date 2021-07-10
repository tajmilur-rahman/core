import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../../../service/customer.service';
import { StatusService } from '../../../../service/status.service';
import { OrderService } from '../../../../service/order.service';
import { UserService } from '../../../../service/user.service';
import { AuthService } from '../../../../service/auth.service';
import { CommonService } from '../../../../service/common.service';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent implements OnInit {

  loading = false;
  queryParams: any;
  sessionUser: any = null;
  id: number = 0;
  order: any;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.sessionUser = this.authService.getSession();
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
    });
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.loadOrder();
  }

  loadOrder() {
    this.orderService.getAll({
      search: [{
        field: 'id',
        condition: 'in',
        value: [this.id]
      }]
    }).subscribe(response => {
      this.order = response.result[0];
    });
  }
}
