import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseCardComponent } from '@fuse/components/card';
import { CustomPipesModule } from '@fuse/pipes/custom-pipes.module';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Store } from 'app/types/store.type';
import { StoreService } from '../store.service';

@Component({
    selector: 'app-store-detail',
    templateUrl: 'store-detail.component.html',
    standalone: true,
    imports: [MatIconModule, FuseCardComponent, CommonModule, MatButtonModule, CustomPipesModule, FuseAlertComponent]
})

export class StoreDetailComponent implements OnInit {

    store: Store;

    constructor(
        public matDialogRef: MatDialogRef<StoreDetailComponent>,
        private _storeService: StoreService,
        private _fuseConfimationService: FuseConfirmationService
    ) { }

    ngOnInit() {
        this._storeService.store$.subscribe(store => {
            this.store = store;
        });

    }
}