import { Component, inject, OnInit } from '@angular/core';
import { UserserviceService } from '../../services/userservice.service';
import { userData } from '../../interfaces/users';
import { log } from 'console';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-show-users',
  imports: [RouterLink],
  templateUrl: './show-users.component.html',
  styleUrl: './show-users.component.css',
})
export class ShowUsersComponent implements OnInit {
  allusers!: userData[];
  _users = inject(UserserviceService);

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
        console.log(err);
      },
      complete: () => {
        console.log('Users Fetches successfully');
      },
    });
  }
  deleteUser(_id: string) {
    if (confirm("Are you Sure You want to Delete this User")) {
       this._users.deleteUser(_id).subscribe({
         next: (res) => {
           this.allusers=this.allusers.filter((user)=>user._id!==_id)
           console.log(res);
         },
         error: (err) => {
           console.log(err);
         },
         complete() {
           console.log('Done Delete User');
         },
       });
    }
   
  }
  approveUser(_id: string) {
    this._users.approveUser(_id).subscribe({
      next: (res) => {
        const user = this.allusers.find((userId) => userId._id === _id);
        if (user?.status === 'pending') {
          user.status = 'approved';
        }
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
      complete() {
        console.log('Done Approve Client');
      },
    });
  }
}
