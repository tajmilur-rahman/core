import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { OrderService } from '../../../../service/order.service';
import { IOrder } from '../../../../interface/IOrder';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {merge, Observable, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import { AuthService } from '../../../../service/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, AfterViewInit, AfterContentChecked {
  displayedColumns: string[] = ['id', 'title', 'customerName', 'statusName', 'location', 'schedule', 'technicianName'];
  filteredResults: Observable<IOrder[]>;

  totalCount = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.filteredResults = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loading = true;
          return this.orderService.getAll({
            sort: {
              field: this.sort.active,
              direction: this.sort.direction,
            },
            offset: this.paginator.pageIndex
          });
        }),
        map(data => {
          this.loading = false;
          this.totalCount = data.totalCount;
          return data.result;
        }),
        catchError(() => {
          this.loading = false;
          return observableOf([]);
        })
      );
    });
  }

  resetPaging(): void {
    this.paginator.pageIndex = 0;
  }

  formatSchedule(paramDateTime: string) {
    return moment(paramDateTime).format('MM/DD/YYYY hh:mm A');
  }
}
