import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@app/Services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  signUpForm!: FormGroup;
  submitted = false;
  passwordsMatch = true;
  userData: String="signUp"

  userDetails = {
    password: '',
    password2: '',
  };

  constructor(private router: Router,private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit() {
    this.fullForm(); // Call the function to initialize the form
  }

  fullForm() {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [Validators.required, this.passwordValidator]],
      ConfirmPassword: ['', [Validators.required]],
      role: [2]
    });
  }

  validatePasswords() {
    const passwordOne = this.userDetails.password;
    const passwordTwo = this.userDetails.password2;
    this.passwordsMatch = passwordOne === passwordTwo;
  }

  passwordValidator(control: any) {
    const value = control.value;
    if (!value) {
      return null;
    }
    const hasNumber = /\d/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const validLength = value.length >= 8;
    const passwordValid = hasNumber && hasLowerCase && validLength;
    return passwordValid ? null : { passwordInvalid: true };
  }

  async toEnter() {
    console.log("enter");
    this.submitted = true;
    if (this.signUpForm.invalid) { return; }
    console.log("seccsus");
    this.userService.addUser(this.signUpForm.value).subscribe(
      () => {
        console.log("User added");
        this.router.navigate(['../worker']);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}


