import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../../../service/customer.service';
import { StatusService } from '../../../../service/status.service';
import { OrderService } from '../../../../service/order.service';
import { UserService } from '../../../../service/user.service';
import { forkJoin } from 'rxjs';
import { ICustomer } from 'src/app/interface/ICustomer';
import { IStatus } from 'src/app/interface/IStatus';
import { ITechnician } from 'src/app/interface/ITechnician';
import { PAY_TYPE } from 'src/app/constant/Order';

@Component({
  selector: 'app-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {
  loading = false;
  queryParams: any;
  customerList: ICustomer[] = [];
  statusList: IStatus[] = [];
  technicianList: ITechnician[] = [];
  payTypeList = PAY_TYPE;
  form: FormGroup = new FormGroup({
    // customer_id: new FormControl('', [Validators.required]),
    // status_id: new FormControl(1, [Validators.required]),
    // technician_id: new FormControl('', [Validators.required]),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    start_date: new FormControl('', [Validators.required]),
    start_time: new FormControl('', [Validators.required]),
    end_date: new FormControl(''),
    end_time: new FormControl(''),
    pay_type_id: new FormControl('', [Validators.required]),
    fixed_pay: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private statusService: StatusService,
    private userService: UserService,
    private orderService: OrderService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
    });

    /*this.loading = true;
    forkJoin({
      customerList: this.customerService.getAll(),
      statusListList: this.statusService.getAll(),
      technicianList: this.userService.getAll({
        search: [
          {
            field: 'role_id',
            condition: 'in',
            value: [3]
          }
        ]
      }),
    }).subscribe(({customerList, statusListList, technicianList}) => {
      this.customerList = customerList.result;
      this.statusList = statusListList.result;
      this.technicianList = technicianList.result;
    }, error => {
      this.loading = false;
    }, () => {
      this.loading = false;
    });*/
  }

  submit(): void {
    if (!this.form.valid) {
      return;
    }

    const data = this.form.getRawValue();

    this.loading = true;
    this.orderService.create(data).subscribe(response => {
      this.snackBar.open(response.message.toString(), '', {
        duration: 5000,
        panelClass: ['success']
      });
      this.router.navigate(['private', 'dashboard']);
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