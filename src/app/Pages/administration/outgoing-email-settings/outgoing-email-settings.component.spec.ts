import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingEmailSettingsComponent } from './outgoing-email-settings.component';

describe('OutgoingEmailSettingsComponent', () => {
  let component: OutgoingEmailSettingsComponent;
  let fixture: ComponentFixture<OutgoingEmailSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutgoingEmailSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingEmailSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
