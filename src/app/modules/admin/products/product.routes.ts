import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductService } from './product.service';
import { ProductDetailComponent } from './details/product-detail.component';

export default [
    {
        path: '',
        component: ProductComponent,
        resolve: {
            data: () => inject(ProductService).getProducts(),
        },
        children: [
            {
                path: ':id',
                component: ProductDetailComponent,
                resolve: {
                    data: (route: ActivatedRouteSnapshot) => inject(ProductService).getProduct(route.params['id']),
                }
            }
        ]
    },
] as Routes;
