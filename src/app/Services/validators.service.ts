import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  constructor() { }
 
   phone(input: string): boolean {
    if (!/^\d+$/.test(input)) {
      return false;
    }
      if (input.length < 9|| input.length > 10) {
      return false;
    }
  
    // אם הגענו לכאן, זה אומר שהמחרוזת תקינה
    return true;
  }
   name(input: string): boolean {
    if (!/^[a-zA-Zא-ת]+$/.test(input)) {
      return false;
    }
  
    if (/^(.)\1+$/.test(input)) {
      return false;
    }
  
    if (input.length < 1 || input.length > 22) {
      return false;
    }
      return true;
  }
  futureDate(): (date: string) => boolean {
    return (date: string): boolean => {
      const today = new Date();
      const inputDate = new Date(date);
      // משווה את התאריך עם היום הנוכחי
      return inputDate > today;
    };
  }



  
}
