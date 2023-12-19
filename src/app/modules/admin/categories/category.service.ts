import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from 'app/types/pagination.type';
import { Category } from 'app/types/category.type';
import { environment } from 'environments/environment.development';
import { BehaviorSubject, map, Observable, switchMap, take, tap } from 'rxjs';
import { CategoryGroup } from 'app/types/category-group.type';

@Injectable({ providedIn: 'root' })
export class CategoryService {

    private baseUrl = environment.baseUrl;

    private _category: BehaviorSubject<Category | null> = new BehaviorSubject(null);
    private _categories: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _categoryGroups: BehaviorSubject<CategoryGroup[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<Pagination | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient) { }

    /**
 * Getter for category
 */
    get category$(): Observable<Category> {
        return this._category.asObservable();
    }

    /**
     * Getter for categories
     */
    get categories$(): Observable<Category[]> {
        return this._categories.asObservable();
    }

    /**
     * Getter for category group
     */
    get categoryGroups$(): Observable<CategoryGroup[]> {
        return this._categoryGroups.asObservable();
    }

    /**
 * Getter for pagination
 */
    get pagination$(): Observable<Pagination> {
        return this._pagination.asObservable();
    }

    /**
 * Get categories
 *
 *
 * @param page
 * @param size
 * @param sort
 * @param category
 * @param search
 */
    getCategories(pageNumber: number = 0, pageSize: number = 10, search?: string, status?: string):
        Observable<{ pagination: Pagination; data: Category[] }> {
        return this._httpClient.get<{ pagination: Pagination; data: Category[] }>(this.baseUrl + '/api/categories', {
            params: {
                pageSize: pageSize,
                pageNumber: pageNumber,
                ...(status !== undefined && status !== null && { status }),
                ...(search !== undefined && search !== null && { name: search }),
            }
        }).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._categories.next(response.data);
            }),
        );
    }

    getCategoryGroups(pageNumber: number = 0, pageSize: number = 100, search?: string, status?: string):
        Observable<{ pagination: Pagination; data: CategoryGroup[] }> {
        return this._httpClient.get<{ pagination: Pagination; data: CategoryGroup[] }>(this.baseUrl + '/api/category-groups', {
            params: {
                pageSize: pageSize,
                pageNumber: pageNumber,
                ...(status !== undefined && status !== null && { status }),
                ...(search !== undefined && search !== null && { name: search }),
            }
        }).pipe(
            tap((response) => {
                this._pagination.next(response.pagination);
                this._categoryGroups.next(response.data);
            }),
        );
    }

    /**
* Create category
*/
    createCategory(data) {
        return this.categories$.pipe(
            take(1),
            switchMap((categories) => this._httpClient.post<Category>(this.baseUrl + '/api/categories', data).pipe(
                map((newCategory) => {

                    // Update category list with current page size
                    this._categories.next([newCategory, ...categories].slice(0, this._pagination.value.pageSize));

                    return newCategory;
                })
            ))
        )
    }

    /**
* Get category by id
*/
    getCategory(id: string) {
        return this._httpClient.get<Category>(this.baseUrl + '/api/categories/' + id).pipe(tap((response) => {
            this._category.next(response);
        }))
    }

    /**
    * Update category
    */
    updateCategory(id: string, data) {
        return this.categories$.pipe(
            take(1),
            switchMap((categories) => this._httpClient.put<Category>(this.baseUrl + '/api/categories/' + id, data).pipe(
                map((updatedCategory) => {

                    // Find and replace updated category
                    const index = categories.findIndex(item => item.id === id);
                    categories[index] = updatedCategory;
                    this._categories.next(categories);

                    // Update category
                    this._category.next(updatedCategory);

                    return updatedCategory;
                })
            ))
        )
    }

    /**
* Approve category
*/
    lockCategory(id: string) {
        return this.categories$.pipe(
            take(1),
            switchMap((categories) => this._httpClient.put<Category>(this.baseUrl + '/api/categories/' + id, { status: 'Locked' }).pipe(
                map((updatedCategory) => {

                    // Find and replace updated category
                    const index = categories.findIndex(item => item.id === id);
                    categories[index] = updatedCategory;
                    this._categories.next(categories);

                    // Update category
                    this._category.next(updatedCategory);

                    return updatedCategory;
                })
            ))
        )
    }

    /**
* Reject category
*/
    unlockCategory(id: string) {
        return this.categories$.pipe(
            take(1),
            switchMap((categories) => this._httpClient.put<Category>(this.baseUrl + '/api/categories/' + id, { status: 'Active' }).pipe(
                map((updatedCategory) => {

                    // Find and replace updated category
                    const index = categories.findIndex(item => item.id === id);
                    categories[index] = updatedCategory;
                    this._categories.next(categories);

                    // Update category
                    this._category.next(updatedCategory);

                    return updatedCategory;
                })
            ))
        )
    }
}