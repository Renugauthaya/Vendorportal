import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberrangesettingsComponent } from './numberrangesettings.component';

describe('NumberrangesettingsComponent', () => {
  let component: NumberrangesettingsComponent;
  let fixture: ComponentFixture<NumberrangesettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberrangesettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberrangesettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
