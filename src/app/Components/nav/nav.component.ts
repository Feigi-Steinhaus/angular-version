import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  constructor(public translate: TranslateService) {
    translate.setDefaultLang('he');
  }

  switchLanguage(language: string) {
    this.translate.use(language);
  }
}
