import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCoreContentComponent } from './home-core-content.component';

describe('HomeCoreContentComponent', () => {
  let component: HomeCoreContentComponent;
  let fixture: ComponentFixture<HomeCoreContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeCoreContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeCoreContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
