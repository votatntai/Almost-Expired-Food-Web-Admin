import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { StoreOwner } from 'app/types/store-owner.type';
import { environment } from 'environments/environment.development';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoreOwnerService {

    private baseUrl = environment.baseUrl;

    private _storeOwner: BehaviorSubject<StoreOwner | null> = new BehaviorSubject(null);
    private _storeOwners: BehaviorSubject<StoreOwner[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for storeOwner
 */
    get storeOwner$(): Observable<StoreOwner> {
        return this._storeOwner.asObservable();
    }

    /**
     * Getter for storeOwners
     */
    get storeOwners$(): Observable<StoreOwner[]> {
        return this._storeOwners.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    /**
 * Get storeOwners
 *
 *
 * @param page
 * @param size
 * @param sort
 * @param order
 * @param search
 */
    getStoreOwners(pageNumber: number = 0, pageSize: number = 10, search?: string, status?: string):
        Observable<{ pagination: Pagination; data: StoreOwner[] }> {
        return this._httpClient.get<{ pagination: Pagination; data: StoreOwner[] }>(this.baseUrl + '/api/store-owners', {
            params: {
                pageSize: pageSize,
                pageNumber: pageNumber,
                ...(status !== undefined && status !== null && { status }),
                ...(search !== undefined && search !== null && { name: search }),
            }
        }).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._storeOwners.next(response.data);
            }),
        );
    }

    /**
* Create storeOwner
*/
    createStoreOwner(data) {
        return this.storeOwners$.pipe(
            take(1),
            switchMap((storeOwners) => this._httpClient.post<StoreOwner>(this.baseUrl + '/api/store-owners', data).pipe(
                map((newStoreOwner) => {

                    // Update storeOwner list with current page size
                    this._storeOwners.next([newStoreOwner, ...storeOwners].slice(0, this._pagination.value.pageSize));

                    return newStoreOwner;
                })
            ))
        )
    }

    /**
* Get storeOwner by id
*/
    getStoreOwner(id: string) {
        return this._httpClient.get<StoreOwner>(this.baseUrl + '/api/store-owners/' + id).pipe(tap((response) => {
            this._storeOwner.next(response);
        }))
    }

    /**
    * Update storeOwner
    */
    updateStoreOwner(id: string, data) {
        return this.storeOwners$.pipe(
            take(1),
            switchMap((storeOwners) => this._httpClient.put<StoreOwner>(this.baseUrl + '/api/store-owners/' + id, data).pipe(
                map((updatedStoreOwner) => {

                    // Find and replace updated storeOwner
                    const index = storeOwners.findIndex(item => item.id === id);
                    storeOwners[index] = updatedStoreOwner;
                    this._storeOwners.next(storeOwners);

                    // Update storeOwner
                    this._storeOwner.next(updatedStoreOwner);

                    return updatedStoreOwner;
                })
            ))
        )
    }

    /**
* Approve storeOwner
*/
    lockStoreOwner(id: string) {
        return this.storeOwners$.pipe(
            take(1),
            switchMap((storeOwners) => this._httpClient.put<StoreOwner>(this.baseUrl + '/api/store-owners/' + id, { status: 'Locked' }).pipe(
                map((updatedStoreOwner) => {

                    // Find and replace updated storeOwner
                    const index = storeOwners.findIndex(item => item.id === id);
                    storeOwners[index] = updatedStoreOwner;
                    this._storeOwners.next(storeOwners);

                    // Update storeOwner
                    this._storeOwner.next(updatedStoreOwner);

                    return updatedStoreOwner;
                })
            ))
        )
    }

    /**
* Reject storeOwner
*/
    unlockStoreOwner(id: string) {
        return this.storeOwners$.pipe(
            take(1),
            switchMap((storeOwners) => this._httpClient.put<StoreOwner>(this.baseUrl + '/api/store-owners/' + id, { status: 'Active' }).pipe(
                map((updatedStoreOwner) => {

                    // Find and replace updated storeOwner
                    const index = storeOwners.findIndex(item => item.id === id);
                    storeOwners[index] = updatedStoreOwner;
                    this._storeOwners.next(storeOwners);

                    // Update storeOwner
                    this._storeOwner.next(updatedStoreOwner);

                    return updatedStoreOwner;
                })
            ))
        )
    }
}