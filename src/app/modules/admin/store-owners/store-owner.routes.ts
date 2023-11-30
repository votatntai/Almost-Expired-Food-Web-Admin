import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
// import { StoreOwnerDetailComponent } from './details/report-detail.component';
import { StoreOwnerComponent } from './store-owner.component';
import { StoreOwnerService } from './store-owner.service';
import { StoreOwnerDetailComponent } from './details/store-owner-detail.component';

export default [
    {
        path: '',
        component: StoreOwnerComponent,
        resolve: {
            data: () => inject(StoreOwnerService).getStoreOwners(),
        },
        children: [
            {
                path: ':id',
                component: StoreOwnerDetailComponent,
                resolve: {
                    data: (route: ActivatedRouteSnapshot) => inject(StoreOwnerService).getStoreOwner(route.params['id']),
                }
            }
        ]
    },
] as Routes;
