import { inject } from '@angular/core';
import { CategoryService } from './category.service';
import { Routes } from '@angular/router';
import { CategoryComponent } from './category.component';

export default [
    {
        path: '',
        component: CategoryComponent,
        resolve: {
            data: () => inject(CategoryService).getCategories(),
            groups: () => inject(CategoryService).getCategoryGroups(),
        },
        // children: [
        //     {
        //         path: ':id',
        //         component: CategoryDetailComponent,
        //         resolve: {
        //             data: (route: ActivatedRouteSnapshot) => inject(CategoryService).getCategory(route.params['id']),
        //         }
        //     }
        // ]
    },
] as Routes;
