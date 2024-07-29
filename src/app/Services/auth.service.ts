import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }
  private role: number | null = null;
  login(role: number) {
    this.role = role;
    localStorage.setItem('role', role.toString());
  }
  logout() {
    this.role = null;
    localStorage.removeItem('role');
  }
  getRole(): number | null {
    if (!this.role) {
      const storedRole = localStorage.getItem('role');
      if (storedRole) {
        this.role = parseInt(storedRole, 10);
      }
    }
    return this.role;
  }
  isAuthenticated(): boolean {
    return this.role !== null;
  }
}