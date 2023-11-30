import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { Customer } from 'app/types/customer.type';
import { environment } from 'environments/environment.development';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerService {

    private baseUrl = environment.baseUrl;

    private _customer: BehaviorSubject<Customer | null> = new BehaviorSubject(null);
    private _customers: BehaviorSubject<Customer[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for customer
 */
    get customer$(): Observable<Customer> {
        return this._customer.asObservable();
    }

    /**
     * Getter for customers
     */
    get customers$(): Observable<Customer[]> {
        return this._customers.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    /**
 * Get customers
 *
 *
 * @param page
 * @param size
 * @param sort
 * @param order
 * @param search
 */
    getCustomers(pageNumber: number = 0, pageSize: number = 10, search?: string, status?: string):
        Observable<{ pagination: Pagination; data: Customer[] }> {
        return this._httpClient.get<{ pagination: Pagination; data: Customer[] }>(this.baseUrl + '/api/customers', {
            params: {
                pageSize: pageSize,
                pageNumber: pageNumber,
                ...(status !== undefined && status !== null && { status }),
                ...(search !== undefined && search !== null && { name: search }),
            }
        }).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._customers.next(response.data);
            }),
        );
    }

    /**
* Create customer
*/
    createCustomer(data) {
        return this.customers$.pipe(
            take(1),
            switchMap((customers) => this._httpClient.post<Customer>(this.baseUrl + '/api/customers', data).pipe(
                map((newCustomer) => {

                    // Update customer list with current page size
                    this._customers.next([newCustomer, ...customers].slice(0, this._pagination.value.pageSize));

                    return newCustomer;
                })
            ))
        )
    }

    /**
* Get customer by id
*/
    getCustomer(id: string) {
        return this._httpClient.get<Customer>(this.baseUrl + '/api/customers/' + id).pipe(tap((response) => {
            this._customer.next(response);
        }))
    }

    /**
    * Update customer
    */
    updateCustomer(id: string, data) {
        return this.customers$.pipe(
            take(1),
            switchMap((customers) => this._httpClient.put<Customer>(this.baseUrl + '/api/customers/' + id, data).pipe(
                map((updatedCustomer) => {

                    // Find and replace updated customer
                    const index = customers.findIndex(item => item.id === id);
                    customers[index] = updatedCustomer;
                    this._customers.next(customers);

                    // Update customer
                    this._customer.next(updatedCustomer);

                    return updatedCustomer;
                })
            ))
        )
    }

    /**
* Approve customer
*/
    lockCustomer(id: string) {
        return this.customers$.pipe(
            take(1),
            switchMap((customers) => this._httpClient.put<Customer>(this.baseUrl + '/api/customers/' + id, { status: 'Locked' }).pipe(
                map((updatedCustomer) => {

                    // Find and replace updated customer
                    const index = customers.findIndex(item => item.id === id);
                    customers[index] = updatedCustomer;
                    this._customers.next(customers);

                    // Update customer
                    this._customer.next(updatedCustomer);

                    return updatedCustomer;
                })
            ))
        )
    }

    /**
* Reject customer
*/
    unlockCustomer(id: string) {
        return this.customers$.pipe(
            take(1),
            switchMap((customers) => this._httpClient.put<Customer>(this.baseUrl + '/api/customers/' + id, { status: 'Active' }).pipe(
                map((updatedCustomer) => {

                    // Find and replace updated customer
                    const index = customers.findIndex(item => item.id === id);
                    customers[index] = updatedCustomer;
                    this._customers.next(customers);

                    // Update customer
                    this._customer.next(updatedCustomer);

                    return updatedCustomer;
                })
            ))
        )
    }
}