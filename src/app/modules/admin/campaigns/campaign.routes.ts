import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { CampaignComponent } from './campaign.component';
import { CampaignService } from './campaign.service';
import { CampaignDetailComponent } from './details/campaign-detail.component';

export default [
    {
        path: '',
        component: CampaignComponent,
        resolve: {
            data: () => inject(CampaignService).getCampaigns(),
        },
        children: [
            {
                path: ':id',
                component: CampaignDetailComponent,
                resolve: {
                    data: (route: ActivatedRouteSnapshot) => inject(CampaignService).getCampaign(route.params['id']),
                }
            }
        ]
    },
] as Routes;
