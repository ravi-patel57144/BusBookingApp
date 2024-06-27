import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NbLayoutModule, NbMenuModule, NbButtonModule, NbUserModule, NbActionsModule, NbContextMenuModule, NbIconModule } from '@nebular/theme';

@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    NbLayoutModule,
    NbMenuModule,
    NbButtonModule,
    NbUserModule,
    NbActionsModule,
    NbContextMenuModule,
    NbIconModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    NotFoundComponent
  ]
})
export class SharedModule { }
