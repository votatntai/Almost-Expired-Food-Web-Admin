import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CustomPipesModule } from '@fuse/pipes/custom-pipes.module';
import { Pagination } from 'app/types/pagination.type';
import { Observable, Subject, debounceTime, map, merge, switchMap, takeUntil } from 'rxjs';
import { StoreOwnerService } from './store-owner.service';
import { StoreOwner } from 'app/types/store-owner.type';
import { StoreOwnerDetailComponent } from './details/store-owner-detail.component';

@Component({
    selector: 'app-store-owner',
    templateUrl: 'store-owner.component.html',
    styleUrls: ['store-owner.component.css'],
    standalone: true,
    imports: [CommonModule, MatProgressBarModule, MatIconModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatInputModule,
        MatPaginatorModule, MatSortModule, CustomPipesModule, MatSelectModule
    ],
    providers: [
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                subscriptSizing: 'dynamic'
            }
        }
    ],
})

export class StoreOwnerComponent implements OnInit, AfterViewInit {

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    storeOwners$: Observable<StoreOwner[]>;

    flashMessage: 'success' | 'error' | null = null;
    message: string = null;
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    isLoading: boolean = false;
    pagination: Pagination;
    query: string;
    status: string;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _storeOwnerService: StoreOwnerService,
        private _changeDetectorRef: ChangeDetectorRef,
        private _dialog: MatDialog,
        private router: Router
    ) { }

    ngOnInit() {
        // Get the storeOwners
        this.storeOwners$ = this._storeOwnerService.storeOwners$;

        // Get the pagination
        this._storeOwnerService.pagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: Pagination) => {

                // Update the pagination
                this.pagination = pagination;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        this.subscribeSearchInput();
    }

    /**
* After view init
*/
    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true
            });

            // Detect changes
            this._changeDetectorRef.detectChanges();

            // If the user changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;
                });

            // Get storeOwners if sort or page changes
            merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    this.isLoading = true;
                    return this._storeOwnerService.getStoreOwners(this._paginator.pageIndex, this._paginator.pageSize, this.searchInputControl.value, this.status);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
        }
    }

    subscribeSearchInput() {
        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap((query) => {
                    this.query = query;
                    this.isLoading = true;
                    return this._storeOwnerService.getStoreOwners(0, this._paginator.pageSize, query, this.status);
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();
    }

    onStoreOwnerClick(storeOwnerId: string) {
        this.router.navigate(['/store-owners', storeOwnerId]).then(() => {
            this._dialog.open(StoreOwnerDetailComponent, {
                width: '1080px',
                autoFocus: false
            }).afterClosed().subscribe(data => {
                this.router.navigate(['/store-owners']);
            })
        });
    }

    statusSelectionChange(event: any) {
        this.status = event.value;
        if (event.value === 'All') {
            this.status = undefined;
        }
        this._storeOwnerService.getStoreOwners(0, this._paginator.pageSize, this.query, this.status).subscribe();
    }
}