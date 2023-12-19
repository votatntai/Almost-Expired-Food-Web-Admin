import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    baseUrl = environment.baseUrl;
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _orderQuantities: BehaviorSubject<any> = new BehaviorSubject(null);
    private _revenues: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    get orderQuantities$(): Observable<any> {
        return this._orderQuantities.asObservable();
    }

    get revenues$(): Observable<any> {
        return this._revenues.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getOrderQuantiies(): Observable<any> {
        return this._httpClient.get(this.baseUrl + '/api/orders/quantities').pipe(
            tap((response: any) => {
                this._orderQuantities.next(response);
            }),
        );
    }

    getRevenues(): Observable<any> {
        return this._httpClient.get(this.baseUrl + '/api/revenues/monthly').pipe(
            tap((response: any) => {
                this._revenues.next(response);
            }),
        );
    }
}