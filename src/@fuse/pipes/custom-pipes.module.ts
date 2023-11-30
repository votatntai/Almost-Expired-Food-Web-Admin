import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomerStatusStylePipe } from './customer-status/customer-status-style.pipe';
import { StoreOwnerStatusStylePipe } from './store-owner-status/store-owner-status-style.pipe';

@NgModule({
    declarations: [CustomerStatusStylePipe, StoreOwnerStatusStylePipe],
    imports: [
        CommonModule
    ],
    exports: [CustomerStatusStylePipe, StoreOwnerStatusStylePipe]
})
export class CustomPipesModule { }