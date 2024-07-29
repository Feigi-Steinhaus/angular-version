import { Component } from '@angular/core';
import { LanguageService } from '@app/Services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  showOptions: boolean = false;

  constructor(public translate: TranslateService, private languageService: LanguageService) {
    translate.setDefaultLang('he');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.languageService.setLanguage(language);
  }
  

  updateDetails(): void {
    console.log('Update details clicked')
  }
}
