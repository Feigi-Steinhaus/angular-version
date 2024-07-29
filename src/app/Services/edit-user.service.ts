import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/Model/User'
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class EditUserService {

  constructor(private http:HttpClient) { }

  private apiUrl = `${environment.apiUrl}WeatherForecast/`
  
  
editUser(email:any):Observable<any>{
    return this.http.get(`${this.apiUrl}?email=${email}`);
 }
 editUserPost(user:User){
   this.http.put(`${this.apiUrl}`,user);
}
}
