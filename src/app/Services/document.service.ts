import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private baseUrl = `${environment.apiUrl}api`;

  constructor(private http: HttpClient) { }
  private headers = new HttpHeaders({
    Authorization: `Bearer ${this.getToken()}`,
  });
  getToken() {
    return localStorage.getItem('token');
  }
  upFile(file: FormData, name: string): Observable<string> {
    console.log(name);

    return this.http.post<string>(`${this.baseUrl}/FileUpload/upload?nameFolder=${name}`, file, { headers: this.headers });
  }
  addDocument(document: Document,nameCustomer: string): Observable<boolean> {
    console.log(document);

    return this.http.post<boolean>(`${this.baseUrl}/Document?name=${nameCustomer}`, document, { headers: this.headers });
  }
  getFolders(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/FileUpload/Folders`, { headers: this.headers });
  }
  getFilesInFolder(folderId: string): Observable<any[]> {

    return this.http.get<any[]>(`${this.baseUrl}/FileUpload/folders/${folderId}/files`, { headers: this.headers });
  }


  
}
