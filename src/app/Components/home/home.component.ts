import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '@app/Services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
// role: string = ""
  // ngOnInit() {
  //   this.role = this.route.snapshot.paramMap.get('role')!;
  //   console.log('המספר שהתקבל בניתוב:', this.role);
  //   this.isAdmin = this.checkIfAdmin(this.role);
  //   console.log('isAdmin:', this.isAdmin);
  // }
  // checkIfAdmin(role: any): boolean {
  //   return role === '1' || role === '2';
  // }

  // navigateTo(route: string): void {
  //   this.router.navigate([route]);
  // }

 
  signInForm!: UntypedFormGroup;
  showAlert: boolean = false;
  
  /**
   * Constructor
   */
  constructor(
      private _authService: AuthService,
      private _formBuilder: UntypedFormBuilder,
  )
  {
  }
  
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------
  
  /**
   * On init
   */
  ngOnInit(): void
  {
      // Create the form
      this.signInForm = this._formBuilder.group({
          email     : ['', [Validators.required, Validators.email]],
          password  : ['', Validators.required],
          rememberMe: [''],
      });
  }
  
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  
  /**
   * Sign in
   */
  signIn(): void
  {
  }
}
