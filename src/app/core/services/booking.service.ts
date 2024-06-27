import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Bus {
  id: number;
  travelsName: string;
  description: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  rating: number;
  fare: number;
  seats: number;
}

export interface Passenger {
  name: string;
  age: number | null;
  gender: string;
  seatNumber: string;
}



@Injectable({
  providedIn: 'root'
})

export class BookingService {

  private locations: string[] = [
    'Ahmedabad',
    'Surat',
    'Baroda',
    'Rajkot',
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
  ];


  private buses: Bus[] = [
    { id: 1, travelsName: 'VRL Travels', description: 'Non-AC Seater', origin: 'Ahmedabad', destination: 'Mumbai', departureTime: '08:00', arrivalTime: '14:00', rating: 4.1, fare: 500, seats: 39 },
    { id: 2, travelsName: 'City Land Travels', description: 'AC Semi-Sleeper 2+2 Volvo', origin: 'Mumbai', destination: 'Ahmedabad', departureTime: '10:00', arrivalTime: '16:00', rating: 4.1, fare: 500, seats: 43 },
    { id: 3, travelsName: 'City Land Travels', description: 'AC Seater 2+2 Volvo', origin: 'Surat', destination: 'Mumbai', departureTime: '09:00', arrivalTime: '15:00', rating: 4.0, fare: 400, seats: 26 },
    { id: 4, travelsName: 'Express Travels', description: 'Luxury AC Sleeper', origin: 'Mumbai', destination: 'Surat', departureTime: '11:00', arrivalTime: '17:00', rating: 4.2, fare: 550, seats: 35 },
    { id: 5, travelsName: 'Royal Buses', description: 'AC Seater', origin: 'Baroda', destination: 'Mumbai', departureTime: '07:00', arrivalTime: '13:00', rating: 4.5, fare: 450, seats: 30 },
    { id: 6, travelsName: 'Quick Travels', description: 'Non-AC Sleeper', origin: 'Mumbai', destination: 'Baroda', departureTime: '12:00', arrivalTime: '18:00', rating: 3.9, fare: 400, seats: 25 },
    { id: 7, travelsName: 'Comfort Travels', description: 'AC Semi-Sleeper', origin: 'Rajkot', destination: 'Mumbai', departureTime: '08:30', arrivalTime: '14:30', rating: 4.3, fare: 550, seats: 40 },
    { id: 8, travelsName: 'Prime Buses', description: 'AC Volvo Multi-Axle', origin: 'Mumbai', destination: 'Rajkot', departureTime: '13:00', arrivalTime: '19:00', rating: 4.4, fare: 600, seats: 38 },
    { id: 9, travelsName: 'Fast Track Travels', description: 'AC Seater 2+1', origin: 'Ahmedabad', destination: 'Surat', departureTime: '07:30', arrivalTime: '10:30', rating: 4.0, fare: 350, seats: 32 },
    { id: 10, travelsName: 'Sunrise Buses', description: 'Non-AC Sleeper 2+2', origin: 'Surat', destination: 'Ahmedabad', departureTime: '11:00', arrivalTime: '14:00', rating: 3.8, fare: 300, seats: 28 },
    { id: 11, travelsName: 'Super Express', description: 'AC Semi-Sleeper 2+2', origin: 'Ahmedabad', destination: 'Baroda', departureTime: '06:30', arrivalTime: '09:30', rating: 4.2, fare: 300, seats: 30 },
    { id: 12, travelsName: 'City Connect', description: 'AC Seater 2+1', origin: 'Baroda', destination: 'Ahmedabad', departureTime: '10:00', arrivalTime: '13:00', rating: 4.0, fare: 280, seats: 35 },
    { id: 13, travelsName: 'Royal Comfort', description: 'AC Sleeper 1+1', origin: 'Ahmedabad', destination: 'Rajkot', departureTime: '07:00', arrivalTime: '11:00', rating: 4.5, fare: 450, seats: 28 },
    { id: 14, travelsName: 'Greenline Travels', description: 'Non-AC Seater', origin: 'Rajkot', destination: 'Ahmedabad', departureTime: '12:00', arrivalTime: '16:00', rating: 3.9, fare: 320, seats: 32 },
    { id: 15, travelsName: 'Morning Star', description: 'AC Seater 2+2', origin: 'Surat', destination: 'Baroda', departureTime: '08:00', arrivalTime: '11:00', rating: 4.1, fare: 350, seats: 36 },
    { id: 16, travelsName: 'Sunrise Express', description: 'AC Sleeper 1+2', origin: 'Baroda', destination: 'Surat', departureTime: '12:00', arrivalTime: '15:00', rating: 4.3, fare: 380, seats: 40 },
    { id: 17, travelsName: 'Metro Connect', description: 'AC Semi-Sleeper 2+1', origin: 'Surat', destination: 'Rajkot', departureTime: '09:30', arrivalTime: '13:30', rating: 4.0, fare: 320, seats: 34 },
    { id: 18, travelsName: 'Speedways', description: 'Non-AC Sleeper 2+2', origin: 'Rajkot', destination: 'Surat', departureTime: '14:00', arrivalTime: '18:00', rating: 3.8, fare: 300, seats: 38 },
    { id: 19, travelsName: 'Golden Travels', description: 'AC Seater 2+2', origin: 'Baroda', destination: 'Rajkot', departureTime: '09:00', arrivalTime: '12:00', rating: 4.2, fare: 370, seats: 32 },
    { id: 20, travelsName: 'City Shuttle', description: 'AC Volvo Multi-Axle', origin: 'Rajkot', destination: 'Baroda', departureTime: '13:30', arrivalTime: '16:30', rating: 4.4, fare: 400, seats: 36 },
    { id: 21, travelsName: 'City Shuttle', description: 'AC Volvo Multi-Axle', origin: 'Ahmedabad', destination: 'Bangalore', departureTime: '13:30', arrivalTime: '16:30', rating: 4.4, fare: 400, seats: 36 },
    { id: 22, travelsName: 'City Shuttle', description: 'AC Volvo Multi-Axle', origin: 'Bangalore', destination: 'Ahmedabad', departureTime: '13:30', arrivalTime: '16:30', rating: 4.4, fare: 400, seats: 36 },
    { id: 23, travelsName: 'Morning Star', description: 'AC Volvo Multi-Axle', origin: 'Bangalore', destination: 'Mumbai', departureTime: '13:30', arrivalTime: '16:30', rating: 4.4, fare: 400, seats: 36 },
    { id: 24, travelsName: 'Greenline Travels', description: 'AC Volvo Multi-Axle', origin: 'Ahmedabad', destination: 'Bangalore', departureTime: '14:30', arrivalTime: '20:30', rating: 4.5, fare: 1000, seats: 36 },
    { id: 25, travelsName: 'City Connect', description: 'AC Semi-Sleeper 2+1', origin: 'Bangalore', destination: 'Hyderabad', departureTime: '09:00', arrivalTime: '15:00', rating: 4.2, fare: 800, seats: 30 },
    { id: 26, travelsName: 'Metro Connect', description: 'Non-AC Seater', origin: 'Hyderabad', destination: 'Bangalore', departureTime: '10:30', arrivalTime: '16:30', rating: 3.9, fare: 700, seats: 35 },
    { id: 27, travelsName: 'Express Travels', description: 'AC Sleeper 1+1', origin: 'Chennai', destination: 'Hyderabad', departureTime: '08:00', arrivalTime: '14:00', rating: 4.3, fare: 900, seats: 28 },
    { id: 28, travelsName: 'Super Express', description: 'AC Seater 2+2', origin: 'Hyderabad', destination: 'Chennai', departureTime: '11:00', arrivalTime: '17:00', rating: 4.1, fare: 850, seats: 32 },
    { id: 29, travelsName: 'Royal Buses', description: 'Non-AC Sleeper 2+2', origin: 'Kolkata', destination: 'Delhi', departureTime: '07:30', arrivalTime: '13:30', rating: 4.0, fare: 600, seats: 40 },
    { id: 30, travelsName: 'Speedways', description: 'AC Semi-Sleeper 2+1', origin: 'Delhi', destination: 'Kolkata', departureTime: '13:00', arrivalTime: '19:00', rating: 4.2, fare: 700, seats: 36 },
    { id: 31, travelsName: 'Morning Star', description: 'AC Seater 2+2', origin: 'Mumbai', destination: 'Chennai', departureTime: '08:30', arrivalTime: '14:30', rating: 4.4, fare: 850, seats: 38 },
    { id: 32, travelsName: 'City Land Travels', description: 'AC Volvo Multi-Axle', origin: 'Chennai', destination: 'Mumbai', departureTime: '12:00', arrivalTime: '18:00', rating: 4.5, fare: 950, seats: 42 },
    { id: 33, travelsName: 'Prime Buses', description: 'AC Sleeper 1+2', origin: 'Bangalore', destination: 'Chennai', departureTime: '09:00', arrivalTime: '14:00', rating: 4.3, fare: 800, seats: 34 },
    { id: 34, travelsName: 'Golden Travels', description: 'Non-AC Seater', origin: 'Kolkata', destination: 'Hyderabad', departureTime: '14:30', arrivalTime: '20:30', rating: 4.1, fare: 700, seats: 32 },
    { id: 35, travelsName: 'City Connect', description: 'AC Semi-Sleeper 2+1', origin: 'Ahmedabad', destination: 'Bangalore', departureTime: '08:00', arrivalTime: '14:00', rating: 4.2, fare: 1200, seats: 32 },
    { id: 36, travelsName: 'Greenline Travels', description: 'AC Volvo Multi-Axle', origin: 'Ahmedabad', destination: 'Bangalore', departureTime: '10:30', arrivalTime: '16:30', rating: 4.5, fare: 1300, seats: 36 },
    { id: 37, travelsName: 'Fast Track Travels', description: 'AC Seater 2+2', origin: 'Ahmedabad', destination: 'Bangalore', departureTime: '12:00', arrivalTime: '18:00', rating: 4.1, fare: 1100, seats: 30 },
    { id: 38, travelsName: 'Sunrise Buses', description: 'Non-AC Sleeper 2+2', origin: 'Ahmedabad', destination: 'Bangalore', departureTime: '13:30', arrivalTime: '19:30', rating: 3.8, fare: 1000, seats: 28 },
    { id: 39, travelsName: 'Royal Comfort', description: 'AC Sleeper 1+1', origin: 'Ahmedabad', destination: 'Bangalore', departureTime: '15:00', arrivalTime: '21:00', rating: 4.3, fare: 1400, seats: 34 },
    { id: 40, travelsName: 'City Land Travels', description: 'AC Semi-Sleeper 2+2', origin: 'Ahmedabad', destination: 'Mumbai', departureTime: '07:00', arrivalTime: '13:00', rating: 4.0, fare: 800, seats: 36 },
    { id: 41, travelsName: 'Express Travels', description: 'AC Sleeper 1+1', origin: 'Ahmedabad', destination: 'Mumbai', departureTime: '09:00', arrivalTime: '15:00', rating: 4.4, fare: 900, seats: 30 },
    { id: 42, travelsName: 'Royal Buses', description: 'Non-AC Seater 2+2', origin: 'Ahmedabad', destination: 'Mumbai', departureTime: '10:30', arrivalTime: '16:30', rating: 4.1, fare: 700, seats: 32 },
    { id: 43, travelsName: 'Morning Star', description: 'AC Seater 2+1', origin: 'Ahmedabad', destination: 'Mumbai', departureTime: '12:00', arrivalTime: '18:00', rating: 4.3, fare: 1000, seats: 28 },
    { id: 44, travelsName: 'Greenline Travels', description: 'AC Volvo Multi-Axle', origin: 'Ahmedabad', destination: 'Mumbai', departureTime: '14:00', arrivalTime: '20:00', rating: 4.5, fare: 1100, seats: 34 },
    { id: 45, travelsName: 'Super Express', description: 'AC Semi-Sleeper 2+2', origin: 'Ahmedabad', destination: 'Surat', departureTime: '08:00', arrivalTime: '11:00', rating: 4.2, fare: 400, seats: 30 },
    { id: 46, travelsName: 'City Connect', description: 'AC Seater 2+1', origin: 'Ahmedabad', destination: 'Surat', departureTime: '10:00', arrivalTime: '13:00', rating: 4.0, fare: 450, seats: 32 },
    { id: 47, travelsName: 'Morning Star', description: 'Non-AC Sleeper 2+2', origin: 'Ahmedabad', destination: 'Surat', departureTime: '12:00', arrivalTime: '15:00', rating: 3.8, fare: 350, seats: 28 },
  ];

  private bookings: any[] = [
    {
      ticketNo: 'TKT901', bookedById: 1, busID: 21, travelsName: 'Super Express', description: 'AC Sleeper', departureTime: '08:00', origin: 'Ahmedabad', journeyDate: '2024-01-01', duration: '6h', arrivalTime: '14:00', destination: 'Mumbai', arrivalDate: '2023-01-01', ticketStatus: 'BOOKED', createdOn: '', modifiedOn: '', fare: 2000, paymentDetails
        : { method: 'cash' },
      passengerDetails: [
        { name: 'John', age: 18, gender: 'Male', seatNumber: 'U15' },
        { name: 'Amanda', age: 18, gender: 'Female', seatNumber: 'U16' }
      ]
    },
    {
      ticketNo: 'TKT902', bookedById: 1, busID: 21, travelsName: 'City Connect', description: 'AC Sleeper', departureTime: '09:00', origin: 'Surat', journeyDate: '2024-07-01', duration: '6h', arrivalTime: '15:00', destination: 'Mumbai', arrivalDate: '2023-02-01', ticketStatus: 'CANCELLED', createdOn: '', modifiedOn: '', fare: 2000, paymentDetails
        : { method: 'cash' },
      passengerDetails: [
        { name: 'Kai', age: 18, gender: 'Male', seatNumber: 'U17' }
      ]
    },
    {
      ticketNo: 'TKT903', bookedById: 1, busID: 40, travelsName: 'Greenline Travels', description: 'AC Sleeper', departureTime: '13:00', origin: 'Mumbai', journeyDate: '2024-07-26', duration: '6h', arrivalTime: '19:00', destination: 'Rajkot', arrivalDate: '2023-01-15', ticketStatus: 'BOOKED', createdOn: '', modifiedOn: '', fare: 2000, paymentDetails
        : { method: 'cash' },
      passengerDetails: [
        { name: 'Maze', age: 18, gender: 'Female', seatNumber: 'U18' }
      ]
    },
    {
      ticketNo: 'TKT904', bookedById: 2, busID: 21, travelsName: 'Morning Star', description: 'AC Sleeper', departureTime: '07:30', origin: 'Ahmedabad', journeyDate: '2023-03-01', duration: '3h', arrivalTime: '10:30', destination: 'Baroda', arrivalDate: '2023-03-01', ticketStatus: 'CANCELLED', createdOn: '', modifiedOn: '', fare: 2000, paymentDetails
        : { method: 'cash' },
      passengerDetails: [
        { name: 'Lucifer', age: 18, gender: 'Male', seatNumber: 'U19' }
      ]
    }
  ];



  constructor() {
    const localStorageBookings = JSON.parse(localStorage.getItem('bookings') || '[]') as any[];
    if (localStorageBookings.length === 0) {
      localStorage.setItem('bookings', JSON.stringify(this.bookings));
    }
  }

  getAllBuses(): Bus[] {
    return this.buses;
  }

  getLocations(): string[] {
    return this.locations;
  }

  searchBuses(origin: string, destination: string, date: string): Bus[] {
    return this.buses.filter(bus =>
      bus.origin.toLowerCase() === origin.toLowerCase() &&
      bus.destination.toLowerCase() === destination.toLowerCase()
    );
  }

  getBusById(busId: number): Bus | undefined {
    return this.buses.find(bus => bus.id === busId);
  }

  bookTicket(bookingDetails: any): boolean {
    try {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      return true;
    } catch (error) {
      console.error('Error saving booking:', error);
      return false;
    }
  }


  getBookings(userId: number): Observable<any[]> {
    try {
      const localStorageBookings = JSON.parse(localStorage.getItem('bookings') || '[]') as any[];
      const userBookings = localStorageBookings.filter(booking => booking.bookedById === userId);
      return of(userBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      return of([]);
    }
  }



}
