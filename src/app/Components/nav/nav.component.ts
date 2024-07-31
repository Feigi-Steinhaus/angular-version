import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/Services/auth.service';
import { LanguageService } from '@app/Services/language.service';
import { UserService } from '@app/Services/user.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{

  ngOnInit() {
    this.updateLinks()
  }

  constructor(public translate: TranslateService,
    private languageService: LanguageService,
    private authService: AuthService,
    private route: Router,
    private userService: UserService
  ) {
    this.currentLanguage = 'he';
    this.translate.use(this.currentLanguage);
    this.languageService.setLanguage(this.currentLanguage);
  }

  links: { path: string, label: string }[] = [];
  currentLanguage: string = "";
  dropdownOpen: boolean = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    console.log(this.dropdownOpen);
  }

  updateLinks() {
    if (this.authService.isLoggedIn()) {
      const role = this.authService.getRole();
      this.links = [];
      if (role === 2) {
        this.links.push(
          { path: '/task', label: 'Tasks' },
          { path: '/leads', label: 'Leads' },
          { path: '/customer', label: 'Customers' }
        )
      }
      if (role == 3) {
        this.links.push(
          { path: '/task', label: 'Tasks' },
          { path: '/project', label: 'Projects' },
          { path: '/leads', label: 'Leads' },
          { path: '/customer', label: 'Customers' },
          { path: '/users', label: 'Users' }
        )
      }
      this.links.push({ path: '/home', label: 'HomePage' })
    }
  }

  switchLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'he' : 'en';
    console.log(this.currentLanguage);
    this.translate.use(this.currentLanguage);
    this.languageService.setLanguage(this.currentLanguage);
  }


  updateDetails(): void {
    console.log('Update details clicked')
  }

  goHome() {
    this.route.navigate(['./home']);
  }

  goLogIn() {
    this.route.navigate(['./login']);
  }

  goSignUp() {
    this.route.navigate(['./sign-up']);
  }

  logOut() {
    this.userService.signOut()
    this.updateLinks()
    window.location.href='/login'
  }
}
