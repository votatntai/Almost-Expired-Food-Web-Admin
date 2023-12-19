import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { Revenue } from 'app/types/revenue.type';
import { environment } from 'environments/environment.development';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RevenueService {

    private baseUrl = environment.baseUrl;

    private _total: BehaviorSubject<number | null> = new BehaviorSubject(null);
    private _revenue: BehaviorSubject<Revenue | null> = new BehaviorSubject(null);
    private _revenues: BehaviorSubject<Revenue[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for revenue
 */
    get revenue$(): Observable<Revenue> {
        return this._revenue.asObservable();
    }

    get total$(): Observable<number> {
        return this._total.asObservable();
    }

    /**
     * Getter for revenues
     */
    get revenues$(): Observable<Revenue[]> {
        return this._revenues.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    /**
 * Get revenues
 *
 *
 * @param page
 * @param size
 * @param sort
 * @param order
 * @param search
 */
    getRevenues(pageNumber: number = 0, pageSize: number = 10, search?: string, status?: string):
        Observable<{ pagination: Pagination; data: Revenue[] }> {
        return this._httpClient.get<{ pagination: Pagination; data: Revenue[] }>(this.baseUrl + '/api/revenues', {
            params: {
                pageSize: pageSize,
                pageNumber: pageNumber,
                ...(search !== undefined && search !== null && { transactionNo: search }),
            }
        }).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._revenues.next(response.data);
            }),
        );
    }

    /**
* Create revenue
*/
    createRevenue(data) {
        return this.revenues$.pipe(
            take(1),
            switchMap((revenues) => this._httpClient.post<Revenue>(this.baseUrl + '/api/revenues', data).pipe(
                map((newRevenue) => {

                    // Update revenue list with current page size
                    this._revenues.next([newRevenue, ...revenues].slice(0, this._pagination.value.pageSize));

                    return newRevenue;
                })
            ))
        )
    }

    /**
* Get revenue by id
*/
    getRevenue(id: string) {
        return this._httpClient.get<Revenue>(this.baseUrl + '/api/revenues/' + id).pipe(tap((response) => {
            this._revenue.next(response);
        }))
    }

    getTotalRevenue() {
        return this._httpClient.get<number>(this.baseUrl + '/api/revenues/total').pipe(tap((response) => {
            this._total.next(response);
        }))
    }

    /**
    * Update revenue
    */
    updateRevenue(id: string, data) {
        return this.revenues$.pipe(
            take(1),
            switchMap((revenues) => this._httpClient.put<Revenue>(this.baseUrl + '/api/revenues/' + id, data).pipe(
                map((updatedRevenue) => {

                    // Find and replace updated revenue
                    const index = revenues.findIndex(item => item.id === id);
                    revenues[index] = updatedRevenue;
                    this._revenues.next(revenues);

                    // Update revenue
                    this._revenue.next(updatedRevenue);

                    return updatedRevenue;
                })
            ))
        )
    }

    /**
* Approve revenue
*/
    lockRevenue(id: string) {
        return this.revenues$.pipe(
            take(1),
            switchMap((revenues) => this._httpClient.put<Revenue>(this.baseUrl + '/api/revenues/' + id, { status: 'Locked' }).pipe(
                map((updatedRevenue) => {

                    // Find and replace updated revenue
                    const index = revenues.findIndex(item => item.id === id);
                    revenues[index] = updatedRevenue;
                    this._revenues.next(revenues);

                    // Update revenue
                    this._revenue.next(updatedRevenue);

                    return updatedRevenue;
                })
            ))
        )
    }

    /**
* Reject revenue
*/
    unlockRevenue(id: string) {
        return this.revenues$.pipe(
            take(1),
            switchMap((revenues) => this._httpClient.put<Revenue>(this.baseUrl + '/api/revenues/' + id, { status: 'Active' }).pipe(
                map((updatedRevenue) => {

                    // Find and replace updated revenue
                    const index = revenues.findIndex(item => item.id === id);
                    revenues[index] = updatedRevenue;
                    this._revenues.next(revenues);

                    // Update revenue
                    this._revenue.next(updatedRevenue);

                    return updatedRevenue;
                })
            ))
        )
    }
}