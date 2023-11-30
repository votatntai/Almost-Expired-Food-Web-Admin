import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseCardComponent } from '@fuse/components/card';
import { CustomPipesModule } from '@fuse/pipes/custom-pipes.module';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { Customer } from 'app/types/customer.type';
import { CustomerService } from '../customer.service';

@Component({
    selector: 'app-customer-detail',
    templateUrl: 'customer-detail.component.html',
    standalone: true,
    imports: [MatIconModule, FuseCardComponent, CommonModule, MatButtonModule, CustomPipesModule, FuseAlertComponent]
})

export class CustomerDetailComponent implements OnInit {

    customer: Customer;

    constructor(
        public matDialogRef: MatDialogRef<CustomerDetailComponent>,
        private _customerService: CustomerService,
        private _fuseConfimationService: FuseConfirmationService
    ) { }

    ngOnInit() {
        this._customerService.customer$.subscribe(customer => {
            this.customer = customer;
        });

    }

    unlockCustomer() {
        this._fuseConfimationService.open({
            title: 'Unlock this account?',
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
                this._customerService.unlockCustomer(this.customer.id).subscribe();
            }
        });
    }

    lockCustomer() {
        this._fuseConfimationService.open({
            title: 'Lock this account?',
        }).afterClosed().subscribe(result => {
            if (result === 'confirmed') {
                this._customerService.lockCustomer(this.customer.id).subscribe();
            }
        });
    }
}