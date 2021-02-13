import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
}
