import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  getRole(): number | null {
    const storedRole = localStorage.getItem('authData');
    console.log("storedRole", storedRole);
    const role = parseInt(this.decryptRole(storedRole!), 10)
    console.log("role", role);
    return role;
  }

  decryptRole(encryptedRole: string): string {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedRole, 'encryptionKey');
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('authData') !== null;
  }

  getClaim(token: string, claim: string): any {
    const decodedToken=this.getDecodedAccessToken(token)
    // console.log(decodedToken);
    
     return decodedToken ? decodedToken[claim] : null;
   }
   getDecodedAccessToken(token: string): any {
     const helper = new JwtHelperService();
   const decodedToken = helper.decodeToken(token);
   return decodedToken
   }
}