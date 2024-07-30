import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Communication } from '../Model/Communication';
import { environment } from 'src/enviroments/environment';


@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor(private http:HttpClient) { }
  
  private apiUrl = `${environment.apiUrl}Communication/`;

  AddNewCommunication(requestBody:Communication):Observable<Communication>{
    console.log(requestBody);
    return this.http.post<Communication>(`${this.apiUrl}`,requestBody);
  }

  readAll():Observable<Communication[]>{
    return this.http.get<Communication[]>(`${this.apiUrl}`);
  } 

  deleteCommunication(communicationId:number):Observable<boolean>{
    return this.http.delete<boolean>(`${this.apiUrl}?id=${communicationId}` );
  } 
  

}
