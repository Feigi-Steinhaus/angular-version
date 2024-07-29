import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResetPasswordService {
  
  private apiUrl = `${environment.apiUrl}ResetPassword/`;


  constructor(private http: HttpClient) { }

  resetPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}reset`, { email });
  }

  savePassword(pass: string, id: string): Observable<any> {
    return this.http.post<boolean>(`${this.apiUrl}`, { pass, id });
  }

  private serverPassword: string | null = null;
  private userEmail: string | null = null

  setServerPassword(password: string) {
    this.serverPassword = password;
  }

  getServerPassword() {
    return this.serverPassword;
  }

  setUserEmail(email: string) {
    this.userEmail = email
  }

  getUserEmail() {
    return this.userEmail
  }
}