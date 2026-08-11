import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChartsModule } from 'ng2-charts';
import { NgxChartistModule } from 'ngx-chartist';
import { NgxEchartsModule } from 'ngx-echarts';

import { UIModule } from '../../shared/ui/ui.module';
import { ChartRoutingModule } from './chart-routing.module';

import { ChartjsComponent } from './chartjs/chartjs.component';
import { ChartistComponent } from './chartist/chartist.component';
import { EchartComponent } from './echart/echart.component';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  declarations: [ChartjsComponent, ChartistComponent, EchartComponent],
  imports: [
    CommonModule,
    ChartRoutingModule,
    UIModule,
    TabsModule.forRoot(),
    ChartsModule,
    NgxChartistModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ]
})
export class ChartModule { }
