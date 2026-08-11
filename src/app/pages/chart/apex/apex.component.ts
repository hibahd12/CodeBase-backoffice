import { Component, OnInit, ViewChild } from '@angular/core';
import { YstanceEndPoints } from 'src/app/Ystance/YstanceEndPoints';
import { YstanceHelper } from 'src/app/Ystance/YstanceHelper';
import { YstanceService } from 'src/app/Ystance/YstanceService';
import { ChartType } from './apex.model';

@Component({
  selector: 'app-apex',
  templateUrl: './apex.component.html',
  styleUrls: ['./apex.component.scss']
})

/**
 * Apex-chart component
 */
export class ApexComponent implements OnInit {

  /* #region Variables */

  breadCrumbItems: Array<{}>;
  RenamedKeyOfObject: any[] = [];
  ExtractedWeeks: any[] = [];
  selectedDiv: string;
  splineAreaChart: ChartType;

  /* #endregion */

  /* #region Constructor */

  constructor(
    private ystanceService: YstanceService,

  ) { }

  /* #endregion */

  /* #region Init */

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Charts' }, { label: 'Apex charts', active: true }];
  }

  GetArtisanaleFishery() {
    let user: any = JSON.parse(sessionStorage.getItem('currentUser')!);
    let args = {
            thirdPartyEndPointName: 'GetArtisanaleFishery'
    };
    this.ystanceService.apiHandler(YstanceEndPoints.thirdPartyEndPointHandler, args).subscribe(this.OnSuccessGetFishery, YstanceHelper.onErrorResponse);
  }

  GetCephalopodFishery() {
    let user: any = JSON.parse(sessionStorage.getItem('currentUser')!);
    let args = {
            thirdPartyEndPointName: 'GetCephalopodFishery'
    };
    this.ystanceService.apiHandler(YstanceEndPoints.thirdPartyEndPointHandler, args).subscribe(this.OnSuccessGetCephalopodFishery, YstanceHelper.onErrorResponse);
  }

  GetSouthPelagicFishery() {
    let user: any = JSON.parse(sessionStorage.getItem('currentUser')!);
    let args = {
            thirdPartyEndPointName: 'GetSouthPelagicFishery'
    };
    this.ystanceService.apiHandler(YstanceEndPoints.thirdPartyEndPointHandler, args).subscribe(this.OnSuccessGetFishery, YstanceHelper.onErrorResponse);
  }

  GetNorthPelagicFishery() {
    let user: any = JSON.parse(sessionStorage.getItem('currentUser')!);
    let args = {
            thirdPartyEndPointName: 'GetNorthPelagicFishery'
    };
    this.ystanceService.apiHandler(YstanceEndPoints.thirdPartyEndPointHandler, args).subscribe(this.OnSuccessGetFishery, YstanceHelper.onErrorResponse);
  }



  /* #endregion */

  DisplayDashboard(divName: string, LoadDataName: string) {
    this.selectedDiv = divName;
    this[LoadDataName].call(this);
  }

  _fetchData() {
    this.splineAreaChart = {
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      series: this.RenamedKeyOfObject,
      colors: ['#556ee6'],
      xaxis: {
        type: 'date',
        // tslint:disable-next-line: max-line-length
        categories: this.ExtractedWeeks,

      },
      grid: {
        borderColor: '#f1f1f1',
      },
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
      }
    };

  }

  /* #region Arrow Function */

  OnSuccessGetFishery = (response: any) => {
    const FilterDataByYear = response.data.filter((data: any) => data.year === 2023);
    this.RenamedKeyOfObject = FilterDataByYear[0].fleet_weekly_active_units.map(obj => {
      const { fleet, weekly_active_units, ...rest } = obj;
      return { name: fleet, data: weekly_active_units, ...rest };
    });
    this.ExtractedWeeks = FilterDataByYear[0].fleet_weekly_active_units[0].weekly_active_units.map((obj: any) => obj.week_start_date);
    const ExtractedFleet = this.RenamedKeyOfObject.map((object: any) => object.data.map((innerObject: any) => innerObject.active_units));
    this.RenamedKeyOfObject.forEach((obj: any, index: any) => {
      obj.data = ExtractedFleet[index];
    });
    this._fetchData()
  }

  OnSuccessGetCephalopodFishery = (response: any) => {
    const FilterDataByYear = response.data.filter((data: any) => data.year === 2023);
    this.RenamedKeyOfObject = FilterDataByYear[0].fleet_weekly_active_units.map(obj => {
      const { fleet, weekly_active_units, ...rest } = obj;
      return { name: fleet, data: weekly_active_units, ...rest };
    });
    this.ExtractedWeeks = FilterDataByYear[0].fleet_weekly_active_units[0].weekly_active_units.map((obj: any) => obj.week);
    const ExtractedFleet = this.RenamedKeyOfObject.map((object: any) => object.data.map((innerObject: any) => innerObject.active_units));
    this.RenamedKeyOfObject.forEach((obj: any, index: any) => {
      obj.data = ExtractedFleet[index];
    });
    this._fetchData()
  }

  /* #endregion */
}