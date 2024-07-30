import { Component } from '@angular/core';
import { UserService } from './Services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  value: any
  title = 'copyRight';
  constructor(private userService: UserService) {
    this.userService.getHello().subscribe(res=>{
      this.value=res
      console.log("res",res);
    },
  err=>{
    console.log(err);
    this.value=err.error.text
  });
  }
}