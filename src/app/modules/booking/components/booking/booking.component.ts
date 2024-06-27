import { Component, OnInit } from '@angular/core';
import { BookingService } from '../../../../core/services/booking.service';
import { NbDateService, NbToastrService } from '@nebular/theme';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

interface Booking {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
  providers: [DatePipe]
})
export class BookingComponent implements OnInit {
  booking: Booking = {
    origin: '',
    destination: '',
    date: '',
    passengers: 1
  };

  availableLocations: string[] = [];

  originControl = new FormControl('');
  destinationControl = new FormControl('');

  filteredOrigins!: Observable<string[]>;
  filteredDestinations!: Observable<string[]>;

  min: Date;

  constructor(
    private bookingService: BookingService,
    private toastrService: NbToastrService,
    private router: Router,
    private datePipe: DatePipe,
    protected dateService: NbDateService<Date>
  ) {
    this.min = this.dateService.addDay(this.dateService.today(), -0);
  }

  ngOnInit(): void {
    this.availableLocations = this.bookingService.getLocations();

    this.filteredOrigins = this.originControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterLocations(value!))
      );

      this.filteredDestinations = this.destinationControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filterLocations(value!))
      );
  }

  private _filterLocations(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.availableLocations.filter(location =>
      location.toLowerCase().includes(filterValue)
    );
  }

  swapValues() {
    // Swap the form controls
    const temp = this.originControl.value;
    this.originControl.setValue(this.destinationControl.value);
    this.destinationControl.setValue(temp);
  }

  searchBus() {
    const errors = [];

    // Validate if both origin and destination are selected
    if (!this.originControl.value) {
      errors.push('Please select origin.');
    }

    if (!this.destinationControl.value) {
      errors.push('Please select destination.');
    }

    // Validate if date of travel is selected
    if (!this.booking.date) {
      errors.push('Please select date of travel.');
    } else {
      this.booking.date = this.datePipe.transform(this.booking.date, 'yyyy-MM-dd')!;
    }

    // Check if there are any errors before checking if origin and destination are the same
    if (errors.length > 0) {
      errors.forEach(error => {
        this.toastrService.warning(error, 'Warning');
      });
      return;
    }

    // Validate if origin and destination are the same
    if (this.originControl.value === this.destinationControl.value) {
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
        origin: this.originControl.value,
        destination: this.destinationControl.value,
        date: this.booking.date,
        passengers: this.booking.passengers
      }
    });

    this.resetForm();
  }

  resetForm() {
    this.booking = {
      origin: '',
      destination: '',
      date: '',
      passengers: 1
    };
    this.originControl.setValue('');
    this.destinationControl.setValue('');
    this.availableLocations = this.bookingService.getLocations();
  }
}
