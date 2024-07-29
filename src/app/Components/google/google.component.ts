import { Component, Injectable, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { User } from '@app/Model/User';
declare global {
  interface Window {
    google: any;
  }
}
import { UserService } from '@app/Services/user.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.css']
})

@Injectable()
export class GoogleComponent {

  constructor(private dialog: MatDialog,
    private router: Router, private login: UserService) { }

  initGoogleOneTap(): void {
    if (window.google.accounts.id) {
      window.google.accounts.id.initialize({
        client_id: '427515481723-ja7nlkmti3amubd5e5qbtdig27fc06ik.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this)
      });
      window.google.accounts.id.prompt();
    } else {
      console.error("Google accounts.id API not loaded.");
    }
  }

  @Input() userData!: String;

  addUser: User = { firstName: "", lastName: "", email: "", password: "", role: 2 };
  handleCredentialResponse(response: any): void {
    if (response.credential) {
      var idToken = response.credential;
      var decodedToken = this.parseJwt(idToken);
      var email = decodedToken.email;
      var userName = decodedToken.name;
      this.login.getByMail(email).subscribe(res => {
        if (this.userData == "logIn" && res != null) {
          this.login.loginGoogle(email, userName).subscribe(
            (user: User) => {
              if (user.role == 1) {
                this.router.navigate(['/admin']);
              }
              if (user.role == 2) {
                this.router.navigate(['/worker']);
              }
              if (user.role == 3) {
                this.router.navigate(['/customer']);
              }
            },
            error => {
              this.dialog.open(DialogComponent, {
                data: {
                  title: 'שגיאה',
                  context: 'ארעה תקלה במהלך ההתחברות, נסה שנית',
                  buttonText: 'סגור',
                },
              });
            }
          );
        }
        if(this.userData == "logIn" && res == null) {
          this.dialog.open(DialogComponent, {
            data: {
              title: 'שגיאה',
              context: 'המייל לא קיים במערכת עבור ל-SIGNUP',
              buttonText: 'סגור',
            },
          });
        }
        if (this.userData == "signUp" && res == null) {
          this.addUser.email = email;
          this.addUser.firstName = userName;
          this.addUser.role = 2;
          this.login.addUser(this.addUser).subscribe(() => {
            this.router.navigate(['/worker']);
          }
          );
        }
        if(this.userData == "signUp" && res != null) {
          this.dialog.open(DialogComponent, {
            data: {
              title: 'שגיאה',
              context: 'המייל קיים במערכת עבור ל-LOGIN',
              buttonText: 'סגור',
            },
          });
        }
      })
    }
  }

  parseJwt(token: string) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

}