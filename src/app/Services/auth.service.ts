import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

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
}