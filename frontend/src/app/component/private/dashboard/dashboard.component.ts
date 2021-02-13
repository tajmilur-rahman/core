import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loading = false;
  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    forkJoin({
      userList: this.userService.loadAllUsers()
    }).subscribe(({userList}) => {
      //
    }, error => {
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

}
