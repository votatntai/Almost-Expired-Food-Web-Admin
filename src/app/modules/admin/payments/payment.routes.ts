import { Routes } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { PaymentResolver } from './payment.resolvers';

export default [
    {
        path: '',
        component: PaymentComponent,
        resolve: {
            data: PaymentResolver
        },
    },
] as Routes;