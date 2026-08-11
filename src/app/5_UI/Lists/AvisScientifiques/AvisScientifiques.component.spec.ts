import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AvisScientifiquesComponent } from './AvisScientifiques.component';

describe('AvisScientifiquesComponent', () => {
  let component: AvisScientifiquesComponent;
  let fixture: ComponentFixture<AvisScientifiquesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AvisScientifiquesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvisScientifiquesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
