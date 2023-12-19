import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { OrderComponent } from './order.component';
import { OrderService } from './order.service';
import { OrderDetailComponent } from './details/order-detail.component';

export default [
    {
        path: '',
        component: OrderComponent,
        resolve: {
            data: () => inject(OrderService).getOrders(),
        },
        children: [
            {
                path: ':id',
                component: OrderDetailComponent,
                resolve: {
                    data: (route: ActivatedRouteSnapshot) => inject(OrderService).getOrder(route.params['id']),
                }
            }
        ]
    },
] as Routes;
