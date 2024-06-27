import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService } from '../../../../core/services/booking.service';
import { UserService } from '../../../../core/services/user.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.css']
})
export class ViewTicketComponent implements OnInit {
  loggedInUser: any;
  tickets: any[] = [];
  ticketNo: string | null = null;

  bookedAt: string = 'Bus Booking App';

  constructor(
    private bookingService: BookingService,
    private userService: UserService,
    private toastrService: NbToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.userService.getCurrentUser();
    this.route.queryParams.subscribe(params => {
      this.ticketNo = params['ticketNo'];
      if (this.ticketNo) {
        this.loadTicketHistory();
      } else {
        this.toastrService.warning('Ticket number parameter not provided.', 'Warning');
      }
    });
  }

  loadTicketHistory(): void {
    this.bookingService.getBookings(this.loggedInUser.id).subscribe(
      (data: any[]) => {
        console.log('All bookings data:', data);
        this.tickets = data.filter(booking => booking.ticketNo === this.ticketNo);
        if (this.tickets.length === 0) {
          this.toastrService.warning(`Ticket with number ${this.ticketNo} not found.`, 'Warning');
        }
      },
      (error: any) => {
        this.toastrService.danger('Failed to load ticket history', 'Error');
      }
    );
  }

  printTicket(): void {
    let printContents = document.getElementById('ticket-card')!.innerHTML;
    let originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    window.print();

    document.body.innerHTML = originalContents;
  }

  backToTicketHistory() {
    this.router.navigate(['/ticket-history']);
  }
}
