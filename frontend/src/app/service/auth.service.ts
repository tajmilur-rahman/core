import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) {}

  loginUser(username: string, password: string): Observable<any> {
    return this.http.post<any>(`/v1/auth/login`, {username, password});
  }

  setSession(data: any): void {
    sessionStorage.setItem('authentication_info', JSON.stringify(data));
  }

  getSession(): any {
    return JSON.parse(String(sessionStorage.getItem('authentication_info')));
  }

  removeSession(): void {
    sessionStorage.removeItem('authentication_info');
  }

  isUserLoggedIn(): boolean {
    const authenticationInfo = sessionStorage.getItem('authentication_info');
    if (authenticationInfo) {
      return true;
    }

    return false;
  }

  createUser(formData: {
    name: string;
    email: string;
    phone_number: string;
    role_id: number;
    company_name: string;
  }): Observable<any> {
    return this.http.post<any>(`/v1/auth/signup`, formData);
  }

  resetPassword(formData: {
    new_password: string;
    confirm_password: string;
    password_verification_code: string;
  }, id: number): Observable<any> {
    return this.http.put<any>(`/v1/auth/reset-password/${+id}`, formData);
  }

  forgetPassword(formData: {
    email: string;
  }): Observable<any> {
    return this.http.post<any>(`/v1/auth/forget-password`, formData);
  }
}
