import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomerStatusStylePipe } from './customer-status/customer-status-style.pipe';
import { StoreOwnerStatusStylePipe } from './store-owner-status/store-owner-status-style.pipe';
import { CampaignStatusStylePipe } from './campaign-status/campaign-status-style.pipe';
import { OrderStatusStylePipe } from './order-status/order-status-style.pipe';
import { ProductStatusStylePipe } from './product-status/product-status-style.pipe';

@NgModule({
    declarations: [CustomerStatusStylePipe, StoreOwnerStatusStylePipe, CampaignStatusStylePipe, OrderStatusStylePipe, ProductStatusStylePipe],
    imports: [
        CommonModule
    ],
    exports: [CustomerStatusStylePipe, StoreOwnerStatusStylePipe, CampaignStatusStylePipe, OrderStatusStylePipe, ProductStatusStylePipe]
})
export class CustomPipesModule { }