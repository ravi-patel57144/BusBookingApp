import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NbMenuItem, NbToastrService } from '@nebular/theme';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  brandName = 'Bus Booking';
  user = {
    name: 'Ravi Patel'
  };

  items: NbMenuItem[] = [
    // { title: 'Profile', link: '/profile' },
    { title: 'Book Ticket', link: '/booking' },
    // { title: 'Modify Ticket', link: '/modify-ticket' },
    // { title: 'Cancel Ticket', link: '/cancel-ticket' },
    { title: 'Ticket History', link: 'ticket-history' }
  ];

  constructor(private userService: UserService, private router: Router, private toastrService: NbToastrService) { }

  logout(): void {
    this.userService.logout().subscribe(
      logoutSuccessful => {
        if (logoutSuccessful) {
          // Navigate to login page after logout
          this.router.navigate(['/login']);
          this.toastrService.success('Logged out successfully.', 'Logout');
        } else {
          console.error('Logout failed.');
          this.toastrService.danger('Logout failed. Please try again later.', 'Logout');
        }
      },
      error => {
        console.error('Logout error:', error);
        this.toastrService.danger('Logout failed. Please try again later.', 'Logout');
      }
    );
  }

  isLoggedIn(): boolean {
    return this.userService.isLoggedIn();
  }
}
