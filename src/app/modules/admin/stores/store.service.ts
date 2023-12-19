import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { Store } from 'app/types/store.type';
import { environment } from 'environments/environment.development';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoreService {

    private baseUrl = environment.baseUrl;

    private _store: BehaviorSubject<Store | null> = new BehaviorSubject(null);
    private _stores: BehaviorSubject<Store[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for store
 */
    get store$(): Observable<Store> {
        return this._store.asObservable();
    }

    /**
     * Getter for stores
     */
    get stores$(): Observable<Store[]> {
        return this._stores.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    /**
 * Get stores
 *
 *
 * @param page
 * @param size
 * @param sort
 * @param order
 * @param search
 */
    getStores(pageNumber: number = 0, pageSize: number = 10, search?: string, status?: string):
        Observable<{ pagination: Pagination; data: Store[] }> {
        return this._httpClient.get<{ pagination: Pagination; data: Store[] }>(this.baseUrl + '/api/stores', {
            params: {
                pageSize: pageSize,
                pageNumber: pageNumber,
                ...(status !== undefined && status !== null && { status }),
                ...(search !== undefined && search !== null && { name: search }),
            }
        }).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._stores.next(response.data);
            }),
        );
    }

    /**
* Create store
*/
    createStore(data) {
        return this.stores$.pipe(
            take(1),
            switchMap((stores) => this._httpClient.post<Store>(this.baseUrl + '/api/stores', data).pipe(
                map((newStore) => {

                    // Update store list with current page size
                    this._stores.next([newStore, ...stores].slice(0, this._pagination.value.pageSize));

                    return newStore;
                })
            ))
        )
    }

    /**
* Get store by id
*/
    getStore(id: string) {
        return this._httpClient.get<Store>(this.baseUrl + '/api/stores/' + id).pipe(tap((response) => {
            this._store.next(response);
        }))
    }

    /**
    * Update store
    */
    updateStore(id: string, data) {
        return this.stores$.pipe(
            take(1),
            switchMap((stores) => this._httpClient.put<Store>(this.baseUrl + '/api/stores/' + id, data).pipe(
                map((updatedStore) => {

                    // Find and replace updated store
                    const index = stores.findIndex(item => item.id === id);
                    stores[index] = updatedStore;
                    this._stores.next(stores);

                    // Update store
                    this._store.next(updatedStore);

                    return updatedStore;
                })
            ))
        )
    }

    /**
* Approve store
*/
    lockStore(id: string) {
        return this.stores$.pipe(
            take(1),
            switchMap((stores) => this._httpClient.put<Store>(this.baseUrl + '/api/stores/' + id, { status: 'Locked' }).pipe(
                map((updatedStore) => {

                    // Find and replace updated store
                    const index = stores.findIndex(item => item.id === id);
                    stores[index] = updatedStore;
                    this._stores.next(stores);

                    // Update store
                    this._store.next(updatedStore);

                    return updatedStore;
                })
            ))
        )
    }

    /**
* Reject store
*/
    unlockStore(id: string) {
        return this.stores$.pipe(
            take(1),
            switchMap((stores) => this._httpClient.put<Store>(this.baseUrl + '/api/stores/' + id, { status: 'Active' }).pipe(
                map((updatedStore) => {

                    // Find and replace updated store
                    const index = stores.findIndex(item => item.id === id);
                    stores[index] = updatedStore;
                    this._stores.next(stores);

                    // Update store
                    this._store.next(updatedStore);

                    return updatedStore;
                })
            ))
        )
    }
}