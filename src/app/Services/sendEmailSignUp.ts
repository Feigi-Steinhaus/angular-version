import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/environment';
import { User } from '@app/Model/User';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private apiUrl = `${environment.apiUrl}SendEmail/`;


  constructor(private http: HttpClient) { }

  sendEmailSignUp(user: User): Observable<any> {
    const name = `${user.firstName} ${user.lastName}`;
    return this.http.post<any>("https://localhost:7141/SendEmail", { name: name });
}

}