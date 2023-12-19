import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { Order } from 'app/types/order.type';
import { environment } from 'environments/environment.development';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {

    private baseUrl = environment.baseUrl;

    private _order: BehaviorSubject<Order | null> = new BehaviorSubject(null);
    private _orders: BehaviorSubject<Order[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for order
 */
    get order$(): Observable<Order> {
        return this._order.asObservable();
    }

    /**
     * Getter for orders
     */
    get orders$(): Observable<Order[]> {
        return this._orders.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    /**
 * Get orders
 *
 *
 * @param page
 * @param size
 * @param sort
 * @param order
 * @param search
 */
    getOrders(pageNumber: number = 0, pageSize: number = 10, search?: string, status?: string):
        Observable<{ pagination: Pagination; data: Order[] }> {
        return this._httpClient.get<{ pagination: Pagination; data: Order[] }>(this.baseUrl + '/api/orders', {
            params: {
                pageSize: pageSize,
                pageNumber: pageNumber,
                ...(status !== undefined && status !== null && { status }),
                ...(search !== undefined && search !== null && { name: search }),
            }
        }).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._orders.next(response.data);
            }),
        );
    }

    /**
* Create order
*/
    createOrder(data) {
        return this.orders$.pipe(
            take(1),
            switchMap((orders) => this._httpClient.post<Order>(this.baseUrl + '/api/orders', data).pipe(
                map((newOrder) => {

                    // Update order list with current page size
                    this._orders.next([newOrder, ...orders].slice(0, this._pagination.value.pageSize));

                    return newOrder;
                })
            ))
        )
    }

    /**
* Get order by id
*/
    getOrder(id: string) {
        return this._httpClient.get<Order>(this.baseUrl + '/api/orders/' + id).pipe(tap((response) => {
            this._order.next(response);
        }))
    }

    /**
    * Update order
    */
    updateOrder(id: string, data) {
        return this.orders$.pipe(
            take(1),
            switchMap((orders) => this._httpClient.put<Order>(this.baseUrl + '/api/orders/' + id, data).pipe(
                map((updatedOrder) => {

                    // Find and replace updated order
                    const index = orders.findIndex(item => item.id === id);
                    orders[index] = updatedOrder;
                    this._orders.next(orders);

                    // Update order
                    this._order.next(updatedOrder);

                    return updatedOrder;
                })
            ))
        )
    }

    /**
* Approve order
*/
    lockOrder(id: string) {
        return this.orders$.pipe(
            take(1),
            switchMap((orders) => this._httpClient.put<Order>(this.baseUrl + '/api/orders/' + id, { status: 'Locked' }).pipe(
                map((updatedOrder) => {

                    // Find and replace updated order
                    const index = orders.findIndex(item => item.id === id);
                    orders[index] = updatedOrder;
                    this._orders.next(orders);

                    // Update order
                    this._order.next(updatedOrder);

                    return updatedOrder;
                })
            ))
        )
    }

    /**
* Reject order
*/
    unlockOrder(id: string) {
        return this.orders$.pipe(
            take(1),
            switchMap((orders) => this._httpClient.put<Order>(this.baseUrl + '/api/orders/' + id, { status: 'Active' }).pipe(
                map((updatedOrder) => {

                    // Find and replace updated order
                    const index = orders.findIndex(item => item.id === id);
                    orders[index] = updatedOrder;
                    this._orders.next(orders);

                    // Update order
                    this._order.next(updatedOrder);

                    return updatedOrder;
                })
            ))
        )
    }
}