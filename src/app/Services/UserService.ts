// import { Injectable } from '@angular/core';
// import { UserDto } from '../Model/UserTDo';
// import { Observable } from 'rxjs';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   currentUser!: UserDto;

//   constructor(private _httpClient: HttpClient) { }

//   public setCurrentUser(token: string): void {
//     sessionStorage.setItem("token", token);
//   }

//   public getCurrentUser(): UserDto | null {
//     return this.currentUser;
//   }

//   public cheekbyUsername(username: string): Observable<string> {
//     return this._httpClient.get<string>(`https://localhost:7063/api/User/byUsername/${username}`);
//   }

//   public postUser(formData: FormData): Observable<any> {
//     return this._httpClient.post<any>('https://localhost:7063/api/User', formData);
//   }

//   public login(userName: string, password: string): Observable<any> {
//     return this._httpClient.post("https://localhost:7063/api/User/login", { userName, password }, { responseType: 'text' });
//   }

//   public getUserActivity(userId: number): Observable<any> {
//     return this._httpClient.get<any>(`https://localhost:7063/api/User/${userId}/activity`);
//   }

//   public sendEmail(email: string, subject: string, body: string): Observable<any> {
//     const send = {
//       recipientEmail: email,
//       subject: subject,
//       body: body
//     };
//     return this._httpClient.post<any>('https://localhost:7063/api/Email/sendEmail', send);
//   }

//   public getUserByMail(email: string): Observable<any> {
//     return this._httpClient.get<any>(`https://localhost:7063/api/User/Getemail/${email}`);
//   }
// }

