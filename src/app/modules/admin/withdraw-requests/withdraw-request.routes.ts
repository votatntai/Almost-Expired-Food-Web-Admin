import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { WithdrawRequestComponent } from './withdraw-request.component';
import { WithdrawRequestService } from './withdraw-request.service';
// import { WithdrawRequestDetailComponent } from './details/withdraw-request-detail.component';

export default [
    {
        path: '',
        component: WithdrawRequestComponent,
        resolve: {
            data: () => inject(WithdrawRequestService).getWithdrawRequests(),
        },
        // children: [
        //     {
        //         path: ':id',
        //         component: WithdrawRequestDetailComponent,
        //         resolve: {
        //             data: (route: ActivatedRouteSnapshot) => inject(WithdrawRequestService).getWithdrawRequest(route.params['id']),
        //         }
        //     }
        // ]
    },
] as Routes;
