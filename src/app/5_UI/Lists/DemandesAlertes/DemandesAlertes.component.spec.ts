import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DemandesAlertesComponent } from './DemandesAlertes.component';

describe('DemandesAlertesComponent', () => {
  let component: DemandesAlertesComponent;
  let fixture: ComponentFixture<DemandesAlertesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandesAlertesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandesAlertesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
