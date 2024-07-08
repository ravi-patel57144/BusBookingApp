import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { BookingService, Bus } from '../../../../core/services/booking.service';
import { UserService } from '../../../../core/services/user.service';

interface Passenger {
  name: string;
  age: number | null;
  gender: string;
}

interface Seat {
  class: string;
  number: string;
}

@Component({
  selector: 'app-seat-selection',
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.scss']
})
export class SeatSelectionComponent implements OnInit {

  busId!: number;
  passengers: number = 1;
  travelName: string = '';
  originDestination: string = '';
  departureTime: string = '';
  description: string = '';
  arrivalTime: string = '';
  duration: string = '';
  arrivalDate: string = '';

  farePerPassenger: number = 0;
  totalFare: number = 0;
  taxAmount: number = 0;
  grandTotal: number = 0;

  passengerDetails: Passenger[] = [];
  payment = {
    method: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    upiId: ''
  };

  passengerForm: FormGroup;
  paymentForm: FormGroup;

  legends = [
    { class: 'booked', label: 'Booked' },
    { class: 'available', label: 'Available' }
  ];

  seatMapSections: any[] = [];

  loggedInUser: any;
  date: string = '';

  pastPassengers: any[] = [];
  selectedPastPassengers: Passenger[] = [];

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private toastrService: NbToastrService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.passengerForm = this.formBuilder.group({
      passengers: ['', Validators.required]
    });

    this.paymentForm = this.formBuilder.group({
      method: ['', Validators.required],
      cardNumber: [''],
      expiryDate: [''],
      cvv: [''],
      upiId: ['']
    });
  }

  ngOnInit(): void {
    this.pastPassengers = this.bookingService.getPastPassengerDetails();
    console.log('Past Passengers:', this.pastPassengers);

    this.loggedInUser = this.userService.getCurrentUser(); // Get logged-in user

    this.route.params.subscribe(params => {
      this.busId = +params['busId'];
      this.fetchBusDetails(this.busId);
    });

    this.route.queryParams.subscribe(params => {
      this.passengers = +params['passengers'] || 1;
      this.generatePassengerFields(this.passengers);
      this.date = params['date'] || ''; 
      this.calculateFare();
    });

    this.paymentForm.get('method')?.valueChanges.subscribe(method => {
      this.payment = {
        method: method,
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        upiId: ''
      };

      // Clear validation for other payment fields based on selected method
      Object.keys(this.paymentForm.controls).forEach(key => {
        if (key !== 'method') {
          this.paymentForm.get(key)?.clearValidators();
          this.paymentForm.get(key)?.updateValueAndValidity();
        }
      });

      // Set validators based on selected payment method
      if (method === 'card') {
        this.paymentForm.get('cardNumber')?.setValidators([Validators.required]);
        this.paymentForm.get('expiryDate')?.setValidators([Validators.required]);
        this.paymentForm.get('cvv')?.setValidators([Validators.required]);
      } else if (method === 'upi') {
        this.paymentForm.get('upiId')?.setValidators([Validators.required]);
      }

      this.paymentForm.updateValueAndValidity();
    });
  }

  private fetchBusDetails(busId: number) {
    const bus = this.bookingService.getBusById(busId);
    if (bus) {
      this.travelName = bus.travelsName;
      this.originDestination = `${bus.origin} - ${bus.destination}`;
      this.departureTime = bus.departureTime;
      this.arrivalTime = bus.arrivalTime;
      this.description = bus.description;
      this.farePerPassenger = bus.fare;
      this.seatMapSections = this.generateSeatMap(bus);
      this.calculateFare();
    } else {
      this.toastrService.danger(`Bus with ID ${busId} not found.`);
      console.error(`Bus with ID ${busId} not found.`);
    }
  }

  private generateSeatMap(bus: Bus): any[] {
    return [
      {
        title: 'UPPER',
        rows: this.generateSeats('U', 8, 5, bus.id)
      },
      {
        title: 'LOWER',
        rows: this.generateSeats('L', 8, 5, bus.id)
      }
    ];
  }

  private generateSeats(prefix: string, rows: number, seatsPerRow: number, busID: number): any[] {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const bookedSeats = new Set<string>();

    const filteredBookings = bookings.filter((booking: any) => booking.busID === busID || booking.busId === busID);

    filteredBookings.forEach((booking: any) => {
      booking.passengerDetails.forEach((passenger: any) => {
        bookedSeats.add(passenger.seatNumber);
      });
    });

    const seats = [];
    for (let i = 1; i <= rows; i++) {
      const row = [];
      for (let j = 1; j <= seatsPerRow; j++) {
        const seatNumber = `${prefix}${i * seatsPerRow - (seatsPerRow - j)}`;
        const seatClass = bookedSeats.has(seatNumber) ? 'seat booked' : 'seat available';
        row.push({ class: seatClass, number: seatNumber });
      }
      seats.push(row);
    }
    return seats;
  }

  private generatePassengerFields(passengers: number) {
    this.passengerDetails = Array.from({ length: passengers }, () => ({
      name: '',
      age: null,
      gender: ''
    }));
  }

  private calculateFare() {
    this.totalFare = this.passengers * this.farePerPassenger;
    this.taxAmount = this.totalFare * 0.18;
    this.grandTotal = this.totalFare + this.taxAmount;
  }

  selectSeat(seat: Seat) {
    const selectedSeats = this.getSelectedSeats();

    if (seat.class.includes('available')) {
      if (seat.class.includes('selected')) {
        seat.class = 'seat available';
      } else if (selectedSeats.length < this.passengers) {
        seat.class = 'seat selected';
      } else {
        this.toastrService.warning('You can only select seats equal to the number of passengers.', 'Warning');
      }
    } else if (seat.class.includes('selected')) {
      seat.class = 'seat available';
    }
  }

  getSelectedSeats(): string[] {
    return this.seatMapSections.flatMap(section =>
      section.rows.flatMap((row: Seat[]) =>
        row.filter((seat: Seat) => seat.class.includes('selected')).map((seat: Seat) => seat.number)
      )
    );
  }

  selectPastPassenger(passenger: Passenger) {
    const selectedCount = this.selectedPastPassengers.length;

    if (this.passengerDetails.length === this.passengers) {
      this.toastrService.warning('You can only select passengers equal to the number of passengers.', 'Warning');
      return;
    }

    this.selectedPastPassengers.push(passenger);
    this.passengerDetails.push(passenger);
  }

  removePastPassenger(index: number) {
    this.selectedPastPassengers.splice(index, 1);
    this.passengerDetails.splice(index, 1);
  }

  bookTicket() {
    const selectedSeats = this.getSelectedSeats();
    const errors: string[] = [];

    if (selectedSeats.length !== this.passengers) {
      errors.push('Please select seats for all passengers.');
    }

    if (this.passengerDetails.some(passenger => !passenger.name || !passenger.gender)) {
      errors.push('Please fill out all passenger details.');
    }

    const paymentMethod = this.payment.method;

    if (!paymentMethod) {
      errors.push('Please select a payment method.');
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        this.toastrService.warning(error, 'Warning');
      });
      return;
    }

    const duration = this.calculateDuration(this.departureTime, this.arrivalTime);
    const arrivalDate = this.calculateArrivalDate(this.date, this.departureTime, duration);

    const bookingDetails = {
      ticketNo: this.generateTicketId(),
      bookedById: this.loggedInUser.id,
      passengerDetails: this.passengerDetails.map((passenger, index) => ({
        ...passenger,
        seatNumber: selectedSeats[index]
      })),
      busId: this.busId,
      paymentDetails: this.payment,
      fare: this.grandTotal,
      ticketStatus: 'BOOKED',
      createdOn: new Date().toISOString(),
      modifiedOn: new Date().toISOString(),
      journeyDate: this.date,
      isDeleted: false,
      travelsName: this.travelName,
      description: this.description,
      departureTime: this.departureTime,
      origin: this.originDestination.split(' - ')[0],
      destination: this.originDestination.split(' - ')[1],
      arrivalTime: this.arrivalTime,
      duration: duration,
      arrivalDate: arrivalDate
    };

    const isBookingSuccessful = this.bookingService.bookTicket(bookingDetails);
    if (isBookingSuccessful) {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.push(bookingDetails);
      localStorage.setItem('bookings', JSON.stringify(bookings));

      this.toastrService.success('Ticket booked successfully!', 'Success');
      const ticketId = bookingDetails.ticketNo;
      this.router.navigate(['/view-ticket'], { queryParams: { ticketNo: ticketId } });
    } else {
      this.toastrService.danger('Failed to book ticket. Please try again.', 'Error');
    }
  }

  private calculateDuration(departureTime: string, arrivalTime: string): string {
    const [depHour, depMinute] = departureTime.split(':').map(Number);
    const [arrHour, arrMinute] = arrivalTime.split(':').map(Number);

    let durationHour = arrHour - depHour;
    let durationMinute = arrMinute - depMinute;

    if (durationMinute < 0) {
      durationMinute += 60;
      durationHour -= 1;
    }

    if (durationHour < 0) {
      durationHour += 24;
    }

    return `${durationHour}h ${durationMinute}m`;
  }

  private calculateArrivalDate(journeyDate: string, departureTime: string, duration: string): string {
    const journeyDateObj = new Date(journeyDate);
    const [depHour, depMinute] = departureTime.split(':').map(Number);
    const [durationHour, durationMinute] = duration.split(' ').map(d => parseInt(d, 10));

    journeyDateObj.setHours(depHour + durationHour);
    journeyDateObj.setMinutes(depMinute + durationMinute);

    return journeyDateObj.toISOString().split('T')[0];
  }

  private generateTicketId(): string {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

    if (bookings.length === 0) {
      return 'TKT1';
    }

    const lastBooking = bookings[bookings.length - 1];
    const lastTicketId = lastBooking.ticketNo;

    const lastTicketNumber = parseInt(lastTicketId.slice(3), 10);
    const nextTicketNumber = lastTicketNumber + 1;

    return `TKT${nextTicketNumber}`;
  }

}
