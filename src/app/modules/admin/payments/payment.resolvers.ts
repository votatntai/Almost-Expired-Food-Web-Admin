import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { PaymentParams } from 'app/types/payment-params.type';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PaymentResolver implements Resolve<PaymentParams> {
    constructor(private router: Router) { }

    resolve(route: ActivatedRouteSnapshot): Observable<PaymentParams> | Promise<PaymentParams> | PaymentParams {
        // Sử dụng reduce để map các tham số vào đối tượng PaymentParams
        const urlParams: PaymentParams = Array.from(route.queryParamMap.keys).reduce((acc, key) => {
            acc[key] = route.queryParamMap.get(key);
            return acc;
        }, {} as PaymentParams);

        // Kiểm tra điều kiện trước khi thực hiện chuyển hướng
        if (!this.isUrlParamsValid(urlParams)) {
            // Nếu điều kiện không đáp ứng, chuyển hướng đến route khác hoặc trang 404
            this.router.navigate(['404']);
            return null; // Trả về null để không cung cấp dữ liệu cho component hiện tại
        }

        return urlParams;
    }

    private isUrlParamsValid(urlParams: PaymentParams): boolean {
        // Thực hiện các kiểm tra bạn cần trên urlParams để xác định tính hợp lệ
        // Ví dụ: kiểm tra xem vnp_TransactionStatus có giá trị không
        return urlParams.vnp_TransactionStatus !== null && urlParams.vnp_TransactionStatus !== undefined;
    }
}