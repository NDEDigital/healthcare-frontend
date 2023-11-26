import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientsListSliderComponent } from './clients-list-slider.component';

describe('ClientsListSliderComponent', () => {
  let component: ClientsListSliderComponent;
  let fixture: ComponentFixture<ClientsListSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientsListSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientsListSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
