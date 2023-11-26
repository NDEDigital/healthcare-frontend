import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashBoardNavbarComponent } from './dash-board-navbar.component';

describe('DashBoardNavbarComponent', () => {
  let component: DashBoardNavbarComponent;
  let fixture: ComponentFixture<DashBoardNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashBoardNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashBoardNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
