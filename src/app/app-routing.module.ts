import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { LoginComponent } from './modules/auth/login/login.component';
import { RegisterComponent } from './modules/auth/register/register.component';
import { NotFoundComponent } from './modules/shared/not-found/not-found.component';
import { BusesSearchedComponent } from './modules/booking/components/buses-searched/buses-searched.component';
import { SeatSelectionComponent } from './modules/booking/components/seat-selection/seat-selection.component';
import { ViewTicketComponent } from './modules/booking/components/view-ticket/view-ticket.component';
import { TicketHistoryComponent } from './modules/booking/components/ticket-history/ticket-history.component';
import { ModifyTicketComponent } from './modules/booking/components/modify-ticket/modify-ticket.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'booking', loadChildren: () => import('./modules/booking/booking.module').then(m => m.BookingModule) },
  { path: 'searchedbuses', component: BusesSearchedComponent },
  { path: 'seat-selection/:busId', component: SeatSelectionComponent },
  { path: 'view-ticket', component: ViewTicketComponent },
  { path: 'modify-ticket', component: ModifyTicketComponent },
  { path: 'ticket-history', component: TicketHistoryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
