import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FuseAlertComponent } from '@fuse/components/alert';
import { FuseCardComponent } from '@fuse/components/card';
import { CustomPipesModule } from '@fuse/pipes/custom-pipes.module';
import { Product } from 'app/types/product.type';
import { ProductService } from '../product.service';

@Component({
    selector: 'app-product-detail',
    templateUrl: 'product-detail.component.html',
    standalone: true,
    imports: [MatIconModule, FuseCardComponent, CommonModule, MatButtonModule, CustomPipesModule, FuseAlertComponent]
})

export class ProductDetailComponent implements OnInit {

    product: Product;

    constructor(
        public matDialogRef: MatDialogRef<ProductDetailComponent>,
        private _productService: ProductService,
    ) { }

    ngOnInit() {
        this._productService.product$.subscribe(product => {
            this.product = product;
            console.log(this.product);

        });

    }
}