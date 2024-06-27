import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';

interface Passenger {
  name: string;
  age: number;
  gender: string;
}

@Component({
  selector: 'app-modify-ticket',
  templateUrl: './modify-ticket.component.html',
  styleUrls: ['./modify-ticket.component.scss']
})
export class ModifyTicketComponent implements OnInit {
  ticketNo!: string;
  booking: any = {
    journeyDate: '',
    passengerDetails: [] as Passenger[]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: NbToastrService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.ticketNo = params['ticketNo'];
      this.loadBookingDetails();
    });
  }

  loadBookingDetails(): void {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    this.booking = bookings.find((booking: any) => booking.ticketNo === this.ticketNo);

    if (!this.booking) {
      this.toastrService.danger(`Booking with ticket number ${this.ticketNo} not found.`);
      this.router.navigate(['/ticket-history']);
    }
  }

  saveChanges(): void {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const bookingIndex = bookings.findIndex((booking: any) => booking.ticketNo === this.ticketNo);

    if (bookingIndex !== -1) {
      bookings[bookingIndex] = this.booking;
      localStorage.setItem('bookings', JSON.stringify(bookings));
      this.toastrService.success(`Booking ${this.ticketNo} updated successfully.`);
      this.router.navigate(['/ticket-history']);
    } else {
      this.toastrService.danger(`Booking with ticket number ${this.ticketNo} not found.`);
    }
  }

  backToTicketHistory() {
    this.toastrService.primary('No Changes made.', 'Info')
    this.router.navigate(['/ticket-history']);
  }

}
