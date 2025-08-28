import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaddocumentsettingsComponent } from './uploaddocumentsettings.component';

describe('UploaddocumentsettingsComponent', () => {
  let component: UploaddocumentsettingsComponent;
  let fixture: ComponentFixture<UploaddocumentsettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploaddocumentsettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploaddocumentsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
