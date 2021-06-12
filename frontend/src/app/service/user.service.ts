import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IListQueryParams } from '../interface/IListQueryParams';
import { IListResult } from '../interface/IListResult';
import { IUser } from '../interface/IUser';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) {}

  getAll(params: IListQueryParams = {}): Observable<IListResult<IUser>> {
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

    return this.http.get<any>(`/v1/users${queryParams}`);
  }
}
