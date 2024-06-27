// booking.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './components/booking/booking.component';
import { SharedModule } from '../shared/shared.module';
import { NbLayoutModule, NbMenuModule, NbButtonModule, NbCardModule, NbIconModule, NbAutocompleteModule, NbInputModule, NbFormFieldModule, NbSpinnerModule, NbDatepickerModule, NbSidebarModule, NbAlertModule, NbSelectModule, NbRadioModule, NbBadgeModule } from '@nebular/theme';
import { BusesSearchedComponent } from './components/buses-searched/buses-searched.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SeatSelectionComponent } from './components/seat-selection/seat-selection.component';
import { ViewTicketComponent } from './components/view-ticket/view-ticket.component';
import { TicketHistoryComponent } from './components/ticket-history/ticket-history.component';
import { ModifyTicketComponent } from './components/modify-ticket/modify-ticket.component';


@NgModule({
  declarations: [
    BookingComponent,
    BusesSearchedComponent,
    SeatSelectionComponent,
    ViewTicketComponent,
    TicketHistoryComponent,
    ModifyTicketComponent
  ],
  imports: [
    CommonModule,
    BookingRoutingModule,
    SharedModule,
    NbLayoutModule,
    NbMenuModule,
    NbButtonModule,
    NbCardModule,
    FormsModule,
    NbIconModule,
    NbAutocompleteModule,
    NbInputModule,
    NbFormFieldModule,
    ReactiveFormsModule,
    NbSpinnerModule,
    NbDatepickerModule,
    NbSidebarModule,
    NbAlertModule,
    NbSelectModule,
    NbRadioModule,
    NbBadgeModule
  ]
})
export class BookingModule { }
