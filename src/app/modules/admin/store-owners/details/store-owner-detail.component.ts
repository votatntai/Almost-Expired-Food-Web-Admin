import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseCardComponent } from '@fuse/components/card';
import { CustomPipesModule } from '@fuse/pipes/custom-pipes.module';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { StoreOwner } from 'app/types/store-owner.type';
import { StoreOwnerService } from '../store-owner.service';

@Component({
    selector: 'app-store-owner-detail',
    templateUrl: 'store-owner-detail.component.html',
    standalone: true,
    imports: [MatIconModule, FuseCardComponent, CommonModule, MatButtonModule, CustomPipesModule, FuseAlertComponent]
})

export class StoreOwnerDetailComponent implements OnInit {

    storeOwner: StoreOwner;

    constructor(
        public matDialogRef: MatDialogRef<StoreOwnerDetailComponent>,
        private _storeOwnerService: StoreOwnerService,
        private _fuseConfimationService: FuseConfirmationService
    ) { }

    ngOnInit() {
        this._storeOwnerService.storeOwner$.subscribe(storeOwner => {
            this.storeOwner = storeOwner;
        });

    }

    unlockStoreOwner() {
        this._fuseConfimationService.open({
            title: 'unlock this account?',
            actions: {
                confirm: {
                    color: 'primary'
                }
            },
            icon: {
                name: 'heroicons_outline:check',
                color: 'primary'
            }
        }).afterClosed().subscribe(result => {
            console.log(result);
            if (result === 'confirmed') {
                this._storeOwnerService.unlockStoreOwner(this.storeOwner.id).subscribe();
            }
        });
    }

    lockStoreOwner() {
        this._fuseConfimationService.open({
            title: 'Lock this account?',
        }).afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this._storeOwnerService.lockStoreOwner(this.storeOwner.id).subscribe();
            }
        });
    }
}