import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IListQueryParams } from '../interface/IListQueryParams';
import { IOrder } from '../interface/IOrder';
import { IOrderRequest } from '../interface/IOrderRequest';
import { IListResult } from '../interface/IListResult';
import { IActionResult } from '../interface/IActionResult';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private http: HttpClient
  ) {}

  getAll(params: IListQueryParams = {}): Observable<IListResult<IOrder>> {
    let queryParams = `?1`;

    if (params?.sort) {
      queryParams += `&sort[field]=${params.sort?.field}&sort[direction]=${params.sort?.direction}`;
    }

    if (params?.search) {
      params.search?.forEach(searchValue => {
        queryParams += `&search[${searchValue.field}][condition]=${searchValue.condition}`;
        searchValue.value.forEach(value => {
          queryParams += `&search[${searchValue.field}][value][]=${value}`;
        });
      });
    }

    if (params?.limit) {
      queryParams += `&limit=${+params.limit}`;
    }

    if (params?.offset) {
      queryParams += `&offset=${+params.offset}`;
    }

    return this.http.get<IListResult<IOrder>>(`/v1/orders${queryParams}`);
  }

  getAllRequests(params: IListQueryParams = {}): Observable<IListResult<IOrderRequest>> {
    let queryParams = `?1`;

    if (params?.sort) {
      queryParams += `&sort[field]=${params.sort?.field}&sort[direction]=${params.sort?.direction}`;
    }

    if (params?.search) {
      params.search?.forEach(searchValue => {
        queryParams += `&search[${searchValue.field}][condition]=${searchValue.condition}`;
        searchValue.value.forEach(value => {
          queryParams += `&search[${searchValue.field}][value][]=${value}`;
        });
      });
    }

    if (params?.limit) {
      queryParams += `&limit=${+params.limit}`;
    }

    if (params?.offset) {
      queryParams += `&offset=${+params.offset}`;
    }

    return this.http.get<IListResult<IOrderRequest>>(`/v1/orders/request${queryParams}`);
  }

  create(params: IOrder): Observable<IActionResult<number>> {
    return this.http.post<IActionResult<number>>(`/v1/orders`, params);
  }

  changeStatus(params: any): Observable<IActionResult<number>> {
    return this.http.post<IActionResult<number>>(`/v1/orders/change-status`, params);
  }

  requestOrder(params: any): Observable<IActionResult<number>> {
    return this.http.post<IActionResult<number>>(`/v1/orders/request`, params);
  }

  assignTech(params: any): Observable<IActionResult<number>> {
    return this.http.post<IActionResult<number>>(`/v1/orders/assign-tech`, params);
  }
}
