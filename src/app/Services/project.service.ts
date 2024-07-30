import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  getToken() {
    return localStorage.getItem('token');
  }
  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.getToken()}`,
  });

  getAll(): Observable<any> {
    // const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` });
    return this.http.get(this.apiUrl, { headers: this.headers });
   
  }
  addProject(projectDetails: Project): Observable<any> {
    const url = `${this.apiUrl}`;
     return this.http.post(url, projectDetails, { headers: this.headers });
   }
   deleteProject(id: Number): Observable<Boolean> {
    return this.http.delete<Boolean>(`${this.apiUrl}?id=${id}`, { headers: this.headers });
  }
  getTaskByProject(projectId:string):Observable<any>{
    return this.http.get(`${this.apiUrl}getAllTasks${projectId}`, { headers: this.headers });
}
update(project:Project,id:number): Observable<Project>{
  project.projectId = id;
  console.log(project)
  return this.http.put<Project>(`${this.apiUrl}`, project);
}
getProjectById(id:number): Observable<any> {
  return this.http.get(`${this.apiUrl}getById?id=${id}`, { headers: this.headers });
}

// getToken(): string | null {
//   const tokenJson = localStorage.getItem('token');
//   if (tokenJson) {
//     const t = JSON.parse(tokenJson);
//     return t.token ;
//   }
//   return null;
// }
}

