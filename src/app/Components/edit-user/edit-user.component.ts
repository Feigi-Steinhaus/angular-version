import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/Model/User';
import { EditUserService } from '../../Services/edit-user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
  user: User = {userId:0, firstName: "", lastName: "", password: "", role: 0, email: "", createdDate: new Date }
  flag: Boolean = false;

  constructor(private editUser:EditUserService) {

  }
  edit() {
    localStorage.setItem('user', JSON.stringify("dnxjZ"))
    this.editUser.editUser(localStorage.getItem('email')).subscribe(res => this.user = res)
    this.flag = true
  }
  submit() {
    this.editUser.editUserPost(this.user);
    this.flag = false
  }
}
