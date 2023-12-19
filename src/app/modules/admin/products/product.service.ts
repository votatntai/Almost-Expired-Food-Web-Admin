import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { Product } from 'app/types/product.type';
import { environment } from 'environments/environment.development';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {

    private baseUrl = environment.baseUrl;

    private _product: BehaviorSubject<Product | null> = new BehaviorSubject(null);
    private _products: BehaviorSubject<Product[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for product
 */
    get product$(): Observable<Product> {
        return this._product.asObservable();
    }

    /**
     * Getter for products
     */
    get products$(): Observable<Product[]> {
        return this._products.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    /**
 * Get products
 *
 *
 * @param page
 * @param size
 * @param sort
 * @param product
 * @param search
 */
    getProducts(pageNumber: number = 0, pageSize: number = 10, search?: string, status?: string):
        Observable<{ pagination: Pagination; data: Product[] }> {
        return this._httpClient.get<{ pagination: Pagination; data: Product[] }>(this.baseUrl + '/api/products', {
            params: {
                pageSize: pageSize,
                pageNumber: pageNumber,
                ...(status !== undefined && status !== null && { status }),
                ...(search !== undefined && search !== null && { name: search }),
            }
        }).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._products.next(response.data);
            }),
        );
    }

    /**
* Create product
*/
    createProduct(data) {
        return this.products$.pipe(
            take(1),
            switchMap((products) => this._httpClient.post<Product>(this.baseUrl + '/api/products', data).pipe(
                map((newProduct) => {

                    // Update product list with current page size
                    this._products.next([newProduct, ...products].slice(0, this._pagination.value.pageSize));

                    return newProduct;
                })
            ))
        )
    }

    /**
* Get product by id
*/
    getProduct(id: string) {
        return this._httpClient.get<Product>(this.baseUrl + '/api/products/' + id).pipe(tap((response) => {
            this._product.next(response);
        }))
    }

    /**
    * Update product
    */
    updateProduct(id: string, data) {
        return this.products$.pipe(
            take(1),
            switchMap((products) => this._httpClient.put<Product>(this.baseUrl + '/api/products/' + id, data).pipe(
                map((updatedProduct) => {

                    // Find and replace updated product
                    const index = products.findIndex(item => item.id === id);
                    products[index] = updatedProduct;
                    this._products.next(products);

                    // Update product
                    this._product.next(updatedProduct);

                    return updatedProduct;
                })
            ))
        )
    }

    /**
* Approve product
*/
    lockProduct(id: string) {
        return this.products$.pipe(
            take(1),
            switchMap((products) => this._httpClient.put<Product>(this.baseUrl + '/api/products/' + id, { status: 'Locked' }).pipe(
                map((updatedProduct) => {

                    // Find and replace updated product
                    const index = products.findIndex(item => item.id === id);
                    products[index] = updatedProduct;
                    this._products.next(products);

                    // Update product
                    this._product.next(updatedProduct);

                    return updatedProduct;
                })
            ))
        )
    }

    /**
* Reject product
*/
    unlockProduct(id: string) {
        return this.products$.pipe(
            take(1),
            switchMap((products) => this._httpClient.put<Product>(this.baseUrl + '/api/products/' + id, { status: 'Active' }).pipe(
                map((updatedProduct) => {

                    // Find and replace updated product
                    const index = products.findIndex(item => item.id === id);
                    products[index] = updatedProduct;
                    this._products.next(products);

                    // Update product
                    this._product.next(updatedProduct);

                    return updatedProduct;
                })
            ))
        )
    }
}