import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '@app/Model/Project';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  
  private apiUrl = `${environment.apiUrl}Projects/`

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
  addProject(projectDetails: Project): Observable<any> {
    const url = `${this.apiUrl}`;
     return this.http.post(url, projectDetails);
   }
   deleteProject(id: Number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`);
  }
}
