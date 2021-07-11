import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRequestsComponent } from './order-requests.component';

describe('OrderRequestsComponent', () => {
  let component: OrderRequestsComponent;
  let fixture: ComponentFixture<OrderRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
