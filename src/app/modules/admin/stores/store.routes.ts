import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
// import { StoreDetailComponent } from './details/report-detail.component';
import { StoreComponent } from './store.component';
import { StoreService } from './store.service';
import { StoreDetailComponent } from './details/store-detail.component';

export default [
    {
        path: '',
        component: StoreComponent,
        resolve: {
            data: () => inject(StoreService).getStores(),
        },
        children: [
            {
                path: ':id',
                component: StoreDetailComponent,
                resolve: {
                    data: (route: ActivatedRouteSnapshot) => inject(StoreService).getStore(route.params['id']),
                }
            }
        ]
    },
] as Routes;
