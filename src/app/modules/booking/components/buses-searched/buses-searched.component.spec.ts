import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusesSearchedComponent } from './buses-searched.component';

describe('BusesSearchedComponent', () => {
  let component: BusesSearchedComponent;
  let fixture: ComponentFixture<BusesSearchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BusesSearchedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusesSearchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
