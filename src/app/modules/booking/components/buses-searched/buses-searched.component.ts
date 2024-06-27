import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingService, Bus } from '../../../../core/services/booking.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { NbToastrService } from '@nebular/theme';

interface Passenger {
  name: string;
  age: number;
  gender: string;
}

@Component({
  selector: 'app-buses-searched',
  templateUrl: './buses-searched.component.html',
  styleUrls: ['./buses-searched.component.css']
})
export class BusesSearchedComponent implements OnInit {
  buses: Bus[] = [];
  originControl = new FormControl('');
  destinationControl = new FormControl('');
  date: string = '';
  passengers: number = 1;
  availableLocations: string[] = [];
  filteredOrigins!: Observable<string[]>;
  filteredDestinations!: Observable<string[]>;
  passengerDetails: Passenger[] = [];

  constructor(
    private bookingService: BookingService,
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: NbToastrService,
  ) { }

  ngOnInit(): void {
    this.availableLocations = this.bookingService.getLocations();

    this.filteredOrigins = this.originControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterLocations(value!))
    );

    this.filteredDestinations = this.destinationControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterLocations(value!))
    );

    this.route.queryParams.subscribe(params => {
      this.originControl.setValue(params['origin'] || '');
      this.destinationControl.setValue(params['destination'] || '');
      this.date = params['date'] || '';
      this.passengers = +params['passengers'] || 1;

      this.generatePassengerFields(this.passengers);
      this.searchBuses();
    });
  }

  private filterLocations(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.availableLocations.filter(location =>
      location.toLowerCase().includes(filterValue)
    );
  }

  searchBuses(): void {
    const origin = this.originControl.value;
    const destination = this.destinationControl.value;
    this.buses = this.bookingService.searchBuses(origin!, destination!, this.date);
  }

  onEditSearch(): void {
    const errors = [];

    // Validate if both origin and destination are selected
    if (!this.originControl.value) {
      errors.push('Please select origin.');
    }

    if (!this.destinationControl.value) {
      errors.push('Please select destination.');
    }

    // Validate if date of travel is selected
    if (!this.date) {
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
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        origin: this.originControl.value,
        destination: this.destinationControl.value,
        date: this.date,
        passengers: this.passengers
      },
      queryParamsHandling: 'merge'
    });

    this.searchBuses();
  }

  private generatePassengerFields(passengers: number): void {
    this.passengerDetails = Array.from({ length: passengers }, () => ({
      name: '',
      age: 0,
      gender: ''
    }));
  }

  sortByCheapest(): void {
    this.searchBuses();
    this.buses.sort((a, b) => a.fare - b.fare);
  }

  sortByEarlyDeparture(): void {
    this.searchBuses();
    this.buses.sort((a, b) => {
      const timeA = new Date(`01/01/2021 ${a.departureTime}`);
      const timeB = new Date(`01/01/2021 ${b.departureTime}`);
      return timeA.getTime() - timeB.getTime();
    });
  }

  sortByLateDeparture(): void {
    this.searchBuses();
    this.buses.sort((a, b) => {
      const timeA = new Date(`01/01/2021 ${a.departureTime}`);
      const timeB = new Date(`01/01/2021 ${b.departureTime}`);
      return timeB.getTime() - timeA.getTime();
    });
  }

  filterRecommended(): void {
    this.searchBuses();

    let maxFare = Math.max(...this.buses.map(bus => bus.fare));

    this.buses = this.buses.filter(bus => {
      return bus.fare <= maxFare && bus.rating >= 4;
    });
  }

  showSeatSelection(bus: Bus) {
    this.router.navigate(['/seat-selection', bus.id], {
      queryParams: {
        passengers: this.passengers,
        date: this.date
      }
    });
  }
}
