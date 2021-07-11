import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { OrderService } from '../../../service/order.service';
import { IOrderRequest } from '../../../interface/IOrderRequest';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../service/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-order-requests',
  templateUrl: './order-requests.component.html',
  styleUrls: ['./order-requests.component.scss']
})
export class OrderRequestsComponent implements OnInit, OnChanges {

  @Input() id: number;
  @Output() isReloadOrder = new EventEmitter<boolean>();
  displayedColumns: string[] = ['technicianName', 'createdAt', 'action'];
  result: MatTableDataSource<IOrderRequest>;

  loading = false;
  sessionUser: any = null;
  constructor(
    private orderService: OrderService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.sessionUser = this.authService.getSession();
  }

  ngOnChanges() {
    this.loadOrderList();
  }

  loadOrderList() {
    this.loading = true;
    this.orderService.getAllRequests({
      search: [
        {
          field: 'order_id',
          condition: 'in',
          value: [+this.id],
        }
      ],
    }).subscribe(response => {
      this.result = new MatTableDataSource<IOrderRequest>(response.result);
    }, error => {
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  formatSchedule(paramDateTime: string) {
    return moment(paramDateTime).format('MM/DD/YYYY hh:mm A');
  }

  assignTech(technicianId: number) {
    this.loading = true;
    this.orderService.assignTech({
      id: +this.id,
      technician_id: +technicianId,
    }).subscribe(response => {
      this.isReloadOrder.emit(true);
    }, error => {
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  dismissTech(technicianId: number) {
    //
  }
}
