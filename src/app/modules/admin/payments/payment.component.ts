import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { PaymentParams } from 'app/types/payment-params.type';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule, MatButtonModule, MatIconModule]
})
export class PaymentComponent implements OnInit {
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    paymentParams: PaymentParams = null;
    amout: number = 0;
    isSuccessfull: boolean = true;

    /**
     * Constructor
     */
    constructor(
        private route: ActivatedRoute,
        private cdref: ChangeDetectorRef
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.paymentParams = this.route.snapshot.data.data;
        if (this.paymentParams.vnp_TransactionStatus === '02') {
            this.isSuccessfull = false;
        }
        this.amout = (+this.paymentParams.vnp_Amount / 100);
        this.cdref.detectChanges();
    }

    closeBrowser() {
        window.close();
    }
}
