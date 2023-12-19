import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { WithdrawRequest } from 'app/types/withdraw-request.type';
import { environment } from 'environments/environment.development';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WithdrawRequestService {

    private baseUrl = environment.baseUrl;

    private _withdrawRequest: BehaviorSubject<WithdrawRequest | null> = new BehaviorSubject(null);
    private _withdrawRequests: BehaviorSubject<WithdrawRequest[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for withdrawRequest
 */
    get withdrawRequest$(): Observable<WithdrawRequest> {
        return this._withdrawRequest.asObservable();
    }


    /**
     * Getter for withdrawRequests
     */
    get withdrawRequests$(): Observable<WithdrawRequest[]> {
        return this._withdrawRequests.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    /**
 * Get withdrawRequests
 *
 *
 * @param page
 * @param size
 * @param sort
 * @param order
 * @param search
 */
    getWithdrawRequests(pageNumber: number = 0, pageSize: number = 10, search?: string, status?: string):
        Observable<{ pagination: Pagination; data: WithdrawRequest[] }> {
        return this._httpClient.get<{ pagination: Pagination; data: WithdrawRequest[] }>(this.baseUrl + '/api/withdraw-requests', {
            params: {
                pageSize: pageSize,
                pageNumber: pageNumber,
                ...(search !== undefined && search !== null && { transactionNo: search }),
            }
        }).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._withdrawRequests.next(response.data);
            }),
        );
    }

    /**
* Create withdrawRequest
*/
    createWithdrawRequest(data) {
        return this.withdrawRequests$.pipe(
            take(1),
            switchMap((withdrawRequests) => this._httpClient.post<WithdrawRequest>(this.baseUrl + '/api/withdraw-requests', data).pipe(
                map((newWithdrawRequest) => {

                    // Update withdrawRequest list with current page size
                    this._withdrawRequests.next([newWithdrawRequest, ...withdrawRequests].slice(0, this._pagination.value.pageSize));

                    return newWithdrawRequest;
                })
            ))
        )
    }

    /**
* Get withdrawRequest by id
*/
    getWithdrawRequest(id: string) {
        return this._httpClient.get<WithdrawRequest>(this.baseUrl + '/api/withdraw-requests/' + id).pipe(tap((response) => {
            this._withdrawRequest.next(response);
        }))
    }

    /**
    * Update withdrawRequest
    */
    updateWithdrawRequest(id: string, data) {
        return this.withdrawRequests$.pipe(
            take(1),
            switchMap((withdrawRequests) => this._httpClient.put<WithdrawRequest>(this.baseUrl + '/api/withdraw-requests/' + id, data).pipe(
                map((updatedWithdrawRequest) => {

                    // Find and replace updated withdrawRequest
                    const index = withdrawRequests.findIndex(item => item.id === id);
                    withdrawRequests[index] = updatedWithdrawRequest;
                    this._withdrawRequests.next(withdrawRequests);

                    // Update withdrawRequest
                    this._withdrawRequest.next(updatedWithdrawRequest);

                    return updatedWithdrawRequest;
                })
            ))
        )
    }

    /**
* Approve withdrawRequest
*/
    lockWithdrawRequest(id: string) {
        return this.withdrawRequests$.pipe(
            take(1),
            switchMap((withdrawRequests) => this._httpClient.put<WithdrawRequest>(this.baseUrl + '/api/withdraw-requests/' + id, { status: 'Locked' }).pipe(
                map((updatedWithdrawRequest) => {

                    // Find and replace updated withdrawRequest
                    const index = withdrawRequests.findIndex(item => item.id === id);
                    withdrawRequests[index] = updatedWithdrawRequest;
                    this._withdrawRequests.next(withdrawRequests);

                    // Update withdrawRequest
                    this._withdrawRequest.next(updatedWithdrawRequest);

                    return updatedWithdrawRequest;
                })
            ))
        )
    }

    /**
* Reject withdrawRequest
*/
    unlockWithdrawRequest(id: string) {
        return this.withdrawRequests$.pipe(
            take(1),
            switchMap((withdrawRequests) => this._httpClient.put<WithdrawRequest>(this.baseUrl + '/api/withdraw-requests/' + id, { status: 'Active' }).pipe(
                map((updatedWithdrawRequest) => {

                    // Find and replace updated withdrawRequest
                    const index = withdrawRequests.findIndex(item => item.id === id);
                    withdrawRequests[index] = updatedWithdrawRequest;
                    this._withdrawRequests.next(withdrawRequests);

                    // Update withdrawRequest
                    this._withdrawRequest.next(updatedWithdrawRequest);

                    return updatedWithdrawRequest;
                })
            ))
        )
    }

    progressWithdrawRequest(id: string) {
        return this.withdrawRequests$.pipe(
            take(1),
            switchMap((withdrawRequests) => this._httpClient.post<WithdrawRequest>(this.baseUrl + '/api/withdraw-requests/' + id, null).pipe(
                map((updatedWithdrawRequest) => {

                    // Find and replace updated withdrawRequest
                    const index = withdrawRequests.findIndex(item => item.id === id);
                    withdrawRequests[index] = updatedWithdrawRequest;
                    this._withdrawRequests.next(withdrawRequests);

                    // Update withdrawRequest
                    this._withdrawRequest.next(updatedWithdrawRequest);

                    return updatedWithdrawRequest;
                })
            ))
        )
    }
}