import { ApplicationRef, Component, ComponentFactoryResolver, Injector, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { RoleCodeUser } from '@app/Model/RoleCodeUser';
import { User } from '@app/Model/User';
import { AuthService } from '@app/Services/auth.service';
import { LanguageService } from '@app/Services/language.service';
import { UserService } from '@app/Services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { EditUserComponent } from '../edit-user/edit-user.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{
  users: User[] = [];
  loading: boolean = true;
  componentType!: Type<any>;
  roles: RoleCodeUser[] = [];
  isAdmin: boolean = false;

  // @ViewChild('popupContainer', { read: ViewContainerRef }) popupContainer!: ViewContainerRef;

  @ViewChild('popupContainer', { read: ViewContainerRef })
  popupContainer!: ViewContainerRef;

  ngOnInit(): void {
    // this.loadUsersAndRolesAndtranslate();
    // const role = this.authService.getRole();
    // if (role != 3) {
    //   this.isAdmin = true;
    // }
    this.languageService.language$.subscribe((lang) => {this.loadUsersAndRolesAndtranslate(); console.log("hi!");
    })
  }

  constructor(
    private userService: UserService,
    private resolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector,
    private appRef: ApplicationRef,
    private translate: TranslateService,
    private router: Router,
    private authService: AuthService,
    private languageService: LanguageService
  ) {}

  editUser(user: User) {
    this.componentType = EditUserComponent;
    this.popUpAddOrEdit(user.userId);
  }

  addUser() {
    // this.componentType = SignUpComponent;
    // this.popUpAddOrEdit();
    this.router.navigate(['/sign-up']);
  }

  deleteUser(user: User) {
    this.translate
    .get(['userDeleted', 'userUndeleted', 'userUndefind', 'userUnFound'])
    .subscribe((translations) => {
      this.userService.deleteUserById(user.userId!).subscribe(
        (deleted) => {
          if (deleted) {
            Swal.fire({ title: translations['userDeleted'], icon: 'success' });
            this.loadUsersAndRolesAndtranslate();
          } else {
            Swal.fire({
              title: translations['userUndeleted'],
              icon: 'error',
            });
          }
        },
        (error) =>
          error.status == 404
            ? Swal.fire({ title: translations['userUnFound'], icon: 'error' })
            : Swal.fire({ title: translations['userUndeleted'], icon: 'error' })
      );
    });
  }

  popUpAddOrEdit(l?: Number) {
    Swal.fire({
      html: '<div id="popupContainer"></div>',
      showConfirmButton: false,
      didOpen: () => {
        const container = document.getElementById('popupContainer');
        if (container) {
          if (container == undefined) console.log(',l;,');
          const factory = this.resolver.resolveComponentFactory(
            this.componentType
          );
          const componentRef = this.popupContainer.createComponent(factory);
          if (l != null && l != undefined) componentRef.instance.userId = l;
          // componentRef.instance.setData(l);
          componentRef.instance.dataRefreshed.subscribe(() => {
            this.loadUsersAndRolesAndtranslate();
          });
          container.appendChild(componentRef.location.nativeElement);
        }
      },
    });
  }
  
  //D
  translateAllRoleInUsers(roles: any) {
    this.users = this.users.map((user) => {
      if (user.role) {
        user.role.description = roles[user.role.description] || '';
      }
      return user;
    });
  }
  //C
  translateAllRoles() {
    this.translate
    .get(this.roles.map((role: RoleCodeUser) => role.description))
    .subscribe((rolestrans) => {
      this.roles = this.roles.map(
        (role1) => (role1.description = rolestrans[role1.description])
      );
      this.translateAllRoleInUsers(rolestrans);
      this.loading = false;
    });
  }
  //B
  getAllRoles() {
    this.userService.getAllRoles().subscribe((roles) => {
      this.roles = roles;
      console.log('getAllRoles');
      this.translateAllRoles();
    });
  }
  //A
  loadUsersAndRolesAndtranslate() {
    try {
      this.userService.getAll().subscribe((users) => {
        this.users = users;
        this.getAllRoles();
      });
    } catch (error) {
      console.log("something worng in loading: ", error);
      
    }
  }

  // getAllUsers() {
  //   this.userService.getAll().subscribe((users) => {
  //     this.users = users;
  //     console.log('getAllUsers');
  //   });
  // }
}
