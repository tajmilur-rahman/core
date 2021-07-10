import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../../../service/customer.service';
import { StatusService } from '../../../../service/status.service';
import { OrderService } from '../../../../service/order.service';
import { UserService } from '../../../../service/user.service';
import { forkJoin, of } from 'rxjs';
import { ICustomer } from '../../../../interface/ICustomer';
import { IStatus } from '../../../../interface/IStatus';
import { ITechnician } from '../../../../interface/ITechnician';
import { ICountryTimezone } from '../../../../interface/ICountryTimezone';
import { PAY_TYPE } from '../../../../constant/Order';
import { AuthService } from '../../../../service/auth.service';
import { CommonService } from '../../../../service/common.service';

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
  countryTimezoneList: ICountryTimezone[] = [];
  payTypeList = PAY_TYPE;
  sessionUser: any = null;
  id: number = 0;
  order: any;
  form: FormGroup = new FormGroup({
    customer_id: new FormControl(0, [Validators.required]),
    technician_id: new FormControl(''),
    status_id: new FormControl(1, [Validators.required]),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    zip: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
    timezone: new FormControl(''),
    start_date: new FormControl('', [Validators.required]),
    start_time: new FormControl('', [Validators.required]),
    end_date: new FormControl(''),
    end_time: new FormControl(''),
    pay_type_id: new FormControl(1, [Validators.required]),
    fixed_pay: new FormControl(''),
    per_hour: new FormControl(''),
    max_hour: new FormControl(''),
    per_device: new FormControl(''),
    max_device: new FormControl(''),
  });

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private statusService: StatusService,
    private userService: UserService,
    private orderService: OrderService,
    private authService: AuthService,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.sessionUser = this.authService.getSession();
    this.route.queryParams.subscribe(params => {
      this.queryParams = params;
    });

    this.form.get('status_id')?.valueChanges.subscribe(val => {
      this.form.get('technician_id')?.clearValidators();
      if (+val !== 1 && +val !== 2 && +val !== 8) {
        this.form.get('technician_id')?.setValidators([Validators.required]);
      }
      this.form.get('technician_id')?.updateValueAndValidity();
    });

    this.form.get('pay_type_id')?.valueChanges.subscribe(val => {
      this.form.get('fixed_pay')?.clearValidators();
      this.form.get('per_hour')?.clearValidators();
      this.form.get('max_hour')?.clearValidators();
      this.form.get('per_device')?.clearValidators();
      this.form.get('max_device')?.clearValidators();

      this.form.get('fixed_pay')?.setValue('');
      this.form.get('per_hour')?.setValue('');
      this.form.get('max_hour')?.setValue('');
      this.form.get('per_device')?.setValue('');
      this.form.get('max_device')?.setValue('');

      if (+val === 1) {
        this.form.get('fixed_pay')?.setValidators([Validators.required, Validators.min(1), Validators.max(1000000)]);
      }

      if (+val === 2) {
        this.form.get('per_hour')?.setValidators([Validators.required, Validators.min(1), Validators.max(1000000)]);
        this.form.get('max_hour')?.setValidators([Validators.required, Validators.min(1), Validators.max(1000000)]);
      }

      if (+val === 3) {
        this.form.get('per_device')?.setValidators([Validators.required, Validators.min(1), Validators.max(1000000)]);
        this.form.get('max_device')?.setValidators([Validators.required, Validators.min(1), Validators.max(1000000)]);
      }

      if (+val === 4) {
        this.form.get('per_hour')?.setValidators([Validators.required, Validators.min(1), Validators.max(1000000)]);
        this.form.get('max_hour')?.setValidators([Validators.required, Validators.min(1), Validators.max(1000000)]);
        this.form.get('per_device')?.setValidators([Validators.required, Validators.min(1), Validators.max(1000000)]);
        this.form.get('max_device')?.setValidators([Validators.required, Validators.min(1), Validators.max(1000000)]);
      }

      this.form.get('fixed_pay')?.updateValueAndValidity();
      this.form.get('per_hour')?.updateValueAndValidity();
      this.form.get('max_hour')?.updateValueAndValidity();
      this.form.get('per_device')?.updateValueAndValidity();
      this.form.get('max_device')?.updateValueAndValidity();
    });

    const timeZoneOffset = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.id = +this.route.snapshot.paramMap.get('id')!;
    this.loading = true;
    forkJoin({
      countryTimezoneList: this.commonService.getCountryTimezones(),
      customerList: this.customerService.getAll({
        search: [
          {
            field: 'status',
            condition: 'in',
            value: [1],
          }
        ],
      }),
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
      order: this.orderService.getAll({
        search: [{
          field: 'id',
          condition: 'in',
          value: [this.id]
        }]
      }),
    }).subscribe(({customerList, statusListList, technicianList, countryTimezoneList, order}) => {
      this.customerList = customerList.result;
      this.statusList = statusListList.result;
      this.technicianList = technicianList.result;
      this.countryTimezoneList = countryTimezoneList.result;
      this.order = order.result[0];

      if (this.id > 0) {
        this.setFormValue();
      } else {
        this.form.get('customer_id')?.setValue(this.sessionUser?.customer_id);
        this.form.get('country')?.setValue(
          (this.countryTimezoneList.filter(country => country.timezones.filter(timezone => timezone === timeZoneOffset).length > 0).length > 0) ? this.countryTimezoneList.filter(country => country.timezones.filter(timezone => timezone === timeZoneOffset).length > 0)[0].name : ''
        );
        this.form.get('timezone')?.setValue(timeZoneOffset);
      }
    }, error => {
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  setFormValue() {
    this.form.get('customer_id')?.setValue(this.order?.customerId);
    this.form.get('technician_id')?.setValue(this.order?.technicianId);
    this.form.get('status_id')?.setValue(this.order?.statusId);
    this.form.get('title')?.setValue(this.order?.title);
    this.form.get('description')?.setValue(this.order?.description);
    this.form.get('address')?.setValue(this.order?.address);
    this.form.get('city')?.setValue(this.order?.city);
    this.form.get('state')?.setValue(this.order?.state);
    this.form.get('zip')?.setValue(this.order?.zip);
    this.form.get('country')?.setValue(this.order?.country);
    this.form.get('timezone')?.setValue(this.order?.timezone);
    this.form.get('start_date')?.setValue(this.order?.startDate);
    this.form.get('start_time')?.setValue(this.order?.startTime);
    this.form.get('end_date')?.setValue(this.order?.endDate);
    this.form.get('end_time')?.setValue(this.order?.endTime);
    this.form.get('pay_type_id')?.setValue(this.order?.payTypeId);
    this.form.get('fixed_pay')?.setValue(this.order?.fixedPay);
    this.form.get('per_hour')?.setValue(this.order?.perHour);
    this.form.get('max_hour')?.setValue(this.order?.maxHour);
    this.form.get('per_device')?.setValue(this.order?.perDevice);
    this.form.get('max_device')?.setValue(this.order?.maxDevice);
  }

  getCountryList() {
    return this.countryTimezoneList.map(country => country.name).sort();
  }

  getTimezoneList(countryName: string = '') {
    return (countryName && this.countryTimezoneList.filter(country => country.name === countryName).length > 0) ? this.countryTimezoneList.filter(country => country.name === countryName)[0].timezones.sort() : this.countryTimezoneList.map(country => country.timezones).reduce((totalTimezone, currentTimezone) => {
      return totalTimezone.concat(currentTimezone);
    }, []).sort();
  }

  submit(): void {
    if (!this.form.valid) {
      return;
    }

    const data = this.form.getRawValue();
    if (this.id > 0) {
      data['id'] = this.id;
    }

    this.loading = true;
    this.orderService.create(data).subscribe(response => {
      this.snackBar.open(response.message.toString(), '', {
        duration: 5000,
        panelClass: ['success']
      });
      this.router.navigate(['private', 'order', response.data]);
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
