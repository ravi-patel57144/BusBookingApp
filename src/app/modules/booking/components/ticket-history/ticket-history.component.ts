import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { BookingService } from '../../../../core/services/booking.service';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket-history',
  templateUrl: './ticket-history.component.html',
  styleUrls: ['./ticket-history.component.scss']
})
export class TicketHistoryComponent implements OnInit {
  loggedInUser: any;
  journeys: any[] = [];
  filteredJourneys: any[] = [];

  constructor(
    private bookingService: BookingService,
    private userService: UserService,
    private toastrService: NbToastrService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.userService.getCurrentUser();
    this.loadTicketHistory();
  }

  loadTicketHistory(): void {
    this.bookingService.getBookings(this.loggedInUser.id).subscribe(
      (data: any) => {
        this.journeys = data;
        this.filteredJourneys = [...this.journeys].reverse();
        console.log('Booking history data:', this.journeys);
      },
      (error: any) => {
        this.toastrService.danger('Failed to load ticket history', 'Error');
      }
    );
  }

  viewTicket(ticketNo: string): void {
    this.router.navigate(['/view-ticket'], { queryParams: { ticketNo: ticketNo } });
  }

  modifyTicket(ticketNo: string): void {
    if (confirm('Are you sure you want to edit this ticket?')) {
      this.router.navigate(['/modify-ticket'], { queryParams: { ticketNo: ticketNo } });
    }
  }

  cancelTicket(ticketNo: string): void {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    console.log('Bookings from localStorage:', bookings);
    console.log('Ticket to cancel:', ticketNo);

    const bookingIndex = bookings.findIndex((booking: any) => booking.ticketNo === ticketNo);

    if (bookingIndex !== -1) {
      const booking = bookings[bookingIndex];
      const currentDate = new Date();
      const journeyDateObj = new Date(booking.journeyDate);

      // if (booking.ticketStatus === 'CANCELLED') {
      //   this.toastrService.warning(`Ticket ${ticketNo} is already cancelled.`);
      //   return;
      // }

      // if (journeyDateObj < currentDate) {
      //   this.toastrService.warning(`Journey for ${ticketNo} is already completed.`);
      //   return;
      // }

      if (confirm('Are you sure you want to cancel the ticket?')) {
        bookings[bookingIndex].ticketStatus = 'CANCELLED';
        localStorage.setItem('bookings', JSON.stringify(bookings));
        this.toastrService.success(`Ticket ${ticketNo} cancelled successfully.`);
        this.loadTicketHistory();
      }
    } else {
      this.toastrService.danger(`Ticket ${ticketNo} not found.`);
    }
  }

  filterLapsedBookings(ticketNo: string): boolean {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const booking = bookings.find((booking: any) => booking.ticketNo === ticketNo);

    if (!booking) {
      return false;
    }

    const currentDate = new Date();
    const journeyDate = new Date(booking.journeyDate);

    return journeyDate <= currentDate;
  }



  allJourney(): void {
    this.filteredJourneys = [...this.journeys].reverse();
  }

  upcomingJourney(): void {
    const currentDate = new Date();
    this.filteredJourneys = this.journeys.filter(journey => {
      const journeyDate = new Date(journey.journeyDate);
      return journeyDate >= currentDate && journey.ticketStatus !== 'CANCELLED';
    }).reverse();
  }


  pastJourney(): void {
    const currentDate = new Date();
    this.filteredJourneys = this.journeys.filter(journey => {
      const journeyDate = new Date(journey.journeyDate);
      return journeyDate < currentDate && journey.ticketStatus !== 'CANCELLED';
    }).reverse();
  }

  cancelledJourney(): void {
    this.filteredJourneys = this.journeys.filter(journey => journey.ticketStatus === 'CANCELLED').reverse();
  }
}
