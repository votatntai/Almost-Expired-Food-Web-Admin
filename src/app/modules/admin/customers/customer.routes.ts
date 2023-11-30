import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
// import { CustomerDetailComponent } from './details/report-detail.component';
import { CustomerComponent } from './customer.component';
import { CustomerService } from './customer.service';
import { CustomerDetailComponent } from './details/customer-detail.component';

export default [
    {
        path: '',
        component: CustomerComponent,
        resolve: {
            data: () => inject(CustomerService).getCustomers(),
        },
        children: [
            {
                path: ':id',
                component: CustomerDetailComponent,
                resolve: {
                    data: (route: ActivatedRouteSnapshot) => inject(CustomerService).getCustomer(route.params['id']),
                }
            }
        ]
    },
] as Routes;
