
import { Component, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/Model/User';
import { ResetPasswordService } from '../../Services/reset-password.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { UserService } from 'src/app/Services/user.service';
import { TranslateService } from '@ngx-translate/core';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  ngOnInit(): void {
    this.logInForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }
  constructor(
    private spinner: NgxSpinnerService,
    private resetPasswordService: ResetPasswordService,
    private dialog: MatDialog,
    private router: Router,
    private userService: UserService,
    private active: ActivatedRoute,
    private translate: TranslateService
  ) {}

  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  logInForm: FormGroup = new FormGroup({});
  get email() {
    return this.logInForm.controls['email'];
  }
  get pass() {
    return this.logInForm.controls['password'];
  }
  userData: String = 'logIn';

  passwordCheck: boolean = false;
  onSubmit() {
    if (this.logInForm.invalid) {
      return;
    }
    this.spinner.show()
    const email = this.email.value;
    const password = this.pass.value;
    this.userService.login(email, password).subscribe(
      (user: any) => {
        this.router.navigate(['/home'])
        this.spinner.hide();
        //     console.log("user");
        //     if (user.role == 1) {
        //       this.router.navigate(['/admin'], { relativeTo: this.active });
        //     }
        //     if (user.role == 2) {
        //       this.router.navigate(['/worker'], { relativeTo: this.active });
        //     }
        //     if (user.role == 3) {
        //       this.router.navigate(['/customer'], { relativeTo: this.active });
        //     }
        //   },
      },
      (error) => {
        // Check if errorMessage contains the specific string
        if (error.status == 500) {
          Swal.fire({
            text: 'Email not found',
            icon: 'error',
            showCancelButton: false,
            showCloseButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Close',
          }).then((res) => {
            this.spinner.hide()
          });
        } else {
          this.spinner.hide()
          this.passwordCheck = true;
        }
      }
    
    )
    this.spinner.hide();
  }
  resetPassword() {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email.value)) {
      this.spinner.show()
      this.resetPasswordService.setUserEmail(this.email.value)
      this.resetPasswordService.resetPassword(this.email.value).subscribe(
        (response) => {
          this.router.navigate(['/ResetPassword']);
          this.resetPasswordService.setServerPassword(response);
          this.spinner.hide()
        },
        (err) => {
          this.spinner.hide()
          if (err.status == 400) {
            this.translate
            .get(['Close', 'EmailNotFound'])
            .subscribe((translations) => {
              Swal.fire({
                text: translations['EmailNotFound'],
                icon: 'error',
                showCancelButton: false,
                showCloseButton: true,
                confirmButtonColor: '#d33',
                confirmButtonText: translations['Close'],
              });
            });
          } else {
            this.translate
            .get(['Close', 'ProblemSendingEmail'])
            .subscribe((translations) => {
              Swal.fire({
                text: translations['ProblemSendingEmail'],
                icon: 'error',
                showCancelButton: false,
                showCloseButton: true,
                confirmButtonColor: '#d33',
                confirmButtonText: translations['Close'],
              }).then((res) => {
                this.spinner.hide()
              });
            });
          }
        }
      );
    } else {
      this.spinner.hide()
      this.translate.get(['Close', 'InvalidEmail']).subscribe(translations => {
        Swal.fire({
          text: translations['InvalidEmail'],
          icon: 'error',
          showCancelButton: false,
          showCloseButton: true,
          confirmButtonColor: '#d33',
          confirmButtonText: translations['Close'],
        });
      });
    }
  }

  signUp() {
    this.router.navigate(['../signUp']);
  }
}
