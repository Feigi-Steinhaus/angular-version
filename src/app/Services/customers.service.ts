import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../Model/Customer';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StatusCodeUser } from '@app/Model/StatusCodeUser';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.apiUrl}Customer/`;
  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.getToken()}`,
  });

  GetAllCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}`, {
      headers: this.headers,
    });
  }
  GetCustomerById(customerId: Number): Observable<any> {
    console.log(
      this.http.get<any>(`${this.apiUrl}GetById?custometId=${customerId}`, {
        headers: this.headers,
      })
    );

    return this.http.get<any>(
      `${this.apiUrl}GetById?custometId=${customerId}`,
      { headers: this.headers }
    );
  }
  AddNewCustomer(newCustomer: any): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}`, newCustomer, {
      headers: this.headers,
    });
  }
  EditCustomer(editCustomer: Customer): Observable<boolean> {
    editCustomer.status = editCustomer.status as StatusCodeUser;
    return this.http.put<boolean>(`${this.apiUrl}`, editCustomer, {
      headers: this.headers,
    });
  }

  DeleteCustomer(customer: Customer): Observable<boolean> {
    customer.status = customer.status as StatusCodeUser;
    return this.http.put<boolean>(`${this.apiUrl}`, customer, {
      headers: this.headers,
    });
  }
  GetAllStatusUser(): Observable<StatusCodeUser[]> {
    return this.http.get<StatusCodeUser[]>(`${this.apiUrl}GetAllStatus`, {
      headers: this.headers,
    });
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
