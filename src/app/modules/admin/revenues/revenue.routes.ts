import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
// import { RevenueDetailComponent } from './details/report-detail.component';
import { RevenueService } from './revenue.service';
import { RevenueComponent } from './revenue.component';

export default [
    {
        path: '',
        component: RevenueComponent,
        resolve: {
            data: () => inject(RevenueService).getRevenues(),
            total: () => inject(RevenueService).getTotalRevenue(),
        },
    },
] as Routes;
