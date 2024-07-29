// language.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageSubject = new BehaviorSubject<string>('he'); // ערך התחלתי
  language$ = this.languageSubject.asObservable();

  setLanguage(lang: string) {
    this.languageSubject.next(lang); // שידור ערך חדש
  }
}
