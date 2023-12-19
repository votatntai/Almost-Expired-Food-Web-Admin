import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseCardComponent } from '@fuse/components/card';
import { CustomPipesModule } from '@fuse/pipes/custom-pipes.module';
import { Order } from 'app/types/order.type';
import { OrderService } from '../order.service';

@Component({
    selector: 'app-order-detail',
    templateUrl: 'order-detail.component.html',
    standalone: true,
    imports: [MatIconModule, FuseCardComponent, CommonModule, MatButtonModule, CustomPipesModule, FuseAlertComponent]
})

export class OrderDetailComponent implements OnInit {

    order: Order;

    constructor(
        public matDialogRef: MatDialogRef<OrderDetailComponent>,
        private _orderService: OrderService,
    ) { }

    ngOnInit() {
        this._orderService.order$.subscribe(order => {
            this.order = order;
            console.log(this.order);

        });

    }
}