import { Component, inject, OnInit } from '@angular/core';
import { UserserviceService } from '../../services/userservice.service';
import { userData } from '../../interfaces/users';

@Component({
  selector: 'app-show-users',
  imports: [],
  templateUrl: './show-users.component.html',
  styleUrl: './show-users.component.css'
})
export class ShowUsersComponent implements OnInit {
  allusers!: userData[];
  _users = inject(UserserviceService)
   
  ngOnInit(): void {
    this.getAllUsers();
  }
  getAllUsers() {
    this._users.getAllUsers().subscribe({
      next: (res) => {
        this.allusers = res.data;
        console.log(this.allusers);
      },
      error: (err: any) => {
        console.log(err)
      },
      complete: () => {
        console.log("Users Fetches successfully")
      }
    })
  }
}
