import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}api/FileUpload/`

  constructor(private http: HttpClient) { }
  upFile(file: FormData): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/upload`, file);
  }
  addDocument(document: FormData):Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/upload`, document);
  }
  getFiles(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/list`);
  }
}
