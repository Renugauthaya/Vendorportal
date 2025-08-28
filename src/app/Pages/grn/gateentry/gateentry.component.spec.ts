import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateentryComponent } from './gateentry.component';

describe('GateentryComponent', () => {
  let component: GateentryComponent;
  let fixture: ComponentFixture<GateentryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GateentryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GateentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
