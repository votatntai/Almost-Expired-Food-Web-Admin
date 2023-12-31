import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards'
    { path: '', pathMatch: 'full', redirectTo: 'dashboards' },

    // Redirect signed-in user to the '/dashboards'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboards' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes') },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes') },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') },
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes') }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes') },
            { path: 'payments', loadChildren: () => import('app/modules/admin/payments/payment.routes') },
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            // { path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes') },
            { path: 'dashboards', loadChildren: () => import('app/modules/admin/dashboards/dashboard.routes') },
            { path: 'customers', loadChildren: () => import('app/modules/admin/customers/customer.routes') },
            { path: 'store-owners', loadChildren: () => import('app/modules/admin/store-owners/store-owner.routes') },
            { path: 'stores', loadChildren: () => import('app/modules/admin/stores/store.routes') },
            { path: 'campaigns', loadChildren: () => import('app/modules/admin/campaigns/campaign.routes') },
            { path: 'orders', loadChildren: () => import('app/modules/admin/orders/order.routes') },
            { path: 'products', loadChildren: () => import('app/modules/admin/products/product.routes') },
            { path: 'categories', loadChildren: () => import('app/modules/admin/categories/category.routes') },
            { path: 'revenues', loadChildren: () => import('app/modules/admin/revenues/revenue.routes') },
            { path: 'withdraw-requests', loadChildren: () => import('app/modules/admin/withdraw-requests/withdraw-request.routes') },
        ]
    },
];
