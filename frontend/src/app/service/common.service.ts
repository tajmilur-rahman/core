import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IListResult } from '../interface/IListResult';
import { ICountryTimezone } from '../interface/ICountryTimezone';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private http: HttpClient
  ) {}

  getCountryTimezones(): Observable<IListResult<ICountryTimezone>> {
    return this.http.get<any>(`/v1/country-timezones`);
  }
}
