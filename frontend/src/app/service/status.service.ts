import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IListQueryParams } from '../interface/IListQueryParams';
import { IStatus } from '../interface/IStatus';
import { IListResult } from '../interface/IListResult';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  constructor(
    private http: HttpClient
  ) {}

  getAll(params: IListQueryParams = {}): Observable<IListResult<IStatus>> {
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

    return this.http.get<IListResult<IStatus>>(`/v1/statuses${queryParams}`);
  }
}
