import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseCardComponent } from '@fuse/components/card';
import { CustomPipesModule } from '@fuse/pipes/custom-pipes.module';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Campaign } from 'app/types/campaign.type';
import { CampaignService } from '../campaign.service';

@Component({
    selector: 'app-campaign-detail',
    templateUrl: 'campaign-detail.component.html',
    standalone: true,
    imports: [MatIconModule, FuseCardComponent, CommonModule, MatButtonModule, CustomPipesModule, FuseAlertComponent]
})

export class CampaignDetailComponent implements OnInit {

    campaign: Campaign;

    constructor(
        public matDialogRef: MatDialogRef<CampaignDetailComponent>,
        private _campaignService: CampaignService,
        private _fuseConfimationService: FuseConfirmationService
    ) { }

    ngOnInit() {
        this._campaignService.campaign$.subscribe(campaign => {
            this.campaign = campaign;
        });

    }
}