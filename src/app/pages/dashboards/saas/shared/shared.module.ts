import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellingchartComponent } from './sellingchart/sellingchart.component';

@NgModule({
  declarations: [SellingchartComponent],
  imports: [
    CommonModule,
  ],
  exports: [SellingchartComponent]
})
export class SharedModule { }
