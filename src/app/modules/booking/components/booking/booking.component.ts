import { Component } from '@angular/core';
import { BookingService } from '../../../../core/services/booking.service';
import { NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {
  booking = {
    origin: '',
    destination: '',
    date: '',
    passengers: 1
  };

  availableLocations: string[];
  selectedOrigin: string = '';
  selectedDestination: string = '';
  minDate: string;

  constructor(
    private bookingService: BookingService,
    private toastrService: NbToastrService,
    private router: Router
  ) {
    this.availableLocations = this.bookingService.getLocations();
    this.minDate = new Date().toISOString().split('T')[0];
  }

  onOriginSelect(selectedOrigin: string) {
    this.selectedOrigin = selectedOrigin;
  }

  onDestinationSelect(selectedDestination: string) {
    this.selectedDestination = selectedDestination;
  }

  swapValues() {
    const temp = this.selectedOrigin;
    this.selectedOrigin = this.selectedDestination;
    this.selectedDestination = temp;
  }

  searchBus() {
    const errors = [];

    // Validate if both origin and destination are selected
    if (!this.selectedOrigin) {
      errors.push('Please select origin.');
    }

    if (!this.selectedDestination) {
      errors.push('Please select destination.');
    }

    // Validate if date of travel is selected
    if (!this.booking.date) {
      errors.push('Please select date of travel.');
    }

    // Check if there are any errors before checking if origin and destination are the same
    if (errors.length > 0) {
      errors.forEach(error => {
        this.toastrService.warning(error, 'Warning');
      });
      return;
    }

    // Validate if origin and destination are the same
    if (this.selectedOrigin === this.selectedDestination) {
      errors.push('Origin and destination cannot be the same.');
    }

    if (errors.length > 0) {
      errors.forEach(error => {
        this.toastrService.warning(error, 'Warning');
      });
      return;
    }

    // Navigate to the buses-searched component with query parameters
    this.router.navigate(['/searchedbuses'], {
      queryParams: {
        origin: this.selectedOrigin,
        destination: this.selectedDestination,
        date: this.booking.date,
        passengers: this.booking.passengers
      }
    });

    this.resetForm();
  }



  resetForm() {
    this.selectedOrigin = '';
    this.selectedDestination = '';
    this.booking.date = '';
    this.booking.passengers = 1;
    this.availableLocations = this.bookingService.getLocations();
    this.minDate = new Date().toISOString().split('T')[0];
  }


}
