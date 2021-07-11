import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrderService } from '../../../../service/order.service';
import { AuthService } from '../../../../service/auth.service';
import * as moment from 'moment';

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
    private snackBar: MatSnackBar,
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
    this.loading = true;
    this.orderService.getAll({
      search: [{
        field: 'id',
        condition: 'in',
        value: [this.id]
      }]
    }).subscribe(response => {
      this.order = response.result[0];
    }, error => {
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  changeStatus(statusId: number) {
    this.loading = true;
    this.orderService.changeStatus({
      id: +this.id,
      status_id: +statusId,
    }).subscribe(response => {
      this.snackBar.open(response.message.toString(), '', {
        duration: 5000,
        panelClass: ['success']
      });
      this.loadOrder();
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

  request(flag = 'request') {
    this.loading = true;
    this.orderService.requestOrder({
      order_id: +this.id,
      flag: flag,
    }).subscribe(response => {
      this.snackBar.open(response.message.toString(), '', {
        duration: 5000,
        panelClass: ['success']
      });
      this.loadOrder();
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

  formatSchedule(paramDateTime: string) {
    return moment(paramDateTime).format('MM/DD/YYYY hh:mm A');
  }

  shouldReloadOrder(event: boolean) {
    if (event) {
      this.loadOrder();
    }
  }
}
