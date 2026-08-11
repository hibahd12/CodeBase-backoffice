import { Component, Input } from '@angular/core';

@Component({
  selector: 'AvisStepper',
  templateUrl: './AvisStepper.component.html',
  styleUrls: ['./AvisStepper.component.scss']
})
export class AvisStepperComponent {

  @Input() currentStep: number = 1;
  @Input() completedSteps: number[] = [];

  steps = [
    { number: 1, label: 'Prise en charge' },
    { number: 2, label: 'Traitement' },
    { number: 3, label: 'Résultat' },
  ];

  isCompleted(stepNumber: number): boolean {
    return this.completedSteps.includes(stepNumber);
  }

  isActive(stepNumber: number): boolean {
    return this.currentStep === stepNumber;
  }

  isFuture(stepNumber: number): boolean {
    return !this.isCompleted(stepNumber) && !this.isActive(stepNumber);
  }
}
