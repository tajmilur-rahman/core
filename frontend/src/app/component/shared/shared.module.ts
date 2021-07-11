import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { OrderRequestsComponent } from './order-requests/order-requests.component';

@NgModule({
  declarations: [
    LoaderComponent,
    OrderRequestsComponent,
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
  ],
  exports: [
    LoaderComponent,
    OrderRequestsComponent,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
  ]
})
export class SharedModule { }
