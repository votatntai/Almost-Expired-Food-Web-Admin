import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CategoryGroup } from 'app/types/category-group.type';
import { Category } from 'app/types/category.type';
import { QuillEditorComponent } from 'ngx-quill';
import { CategoryService } from '../category.service';

@Component({
    selector: 'app-create-category',
    templateUrl: 'create-category.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, NgFor, QuillEditorComponent,
        MatSelectModule
    ],
})
export class CreateCategoryComponent implements OnInit {

    createCategoryForm: UntypedFormGroup;
    category: Category;
    categoryGroup: CategoryGroup[];

    selectedImage: File;
    objectURL: (string | null);

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<CreateCategoryComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _categoryService: CategoryService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.createCategoryForm = this._formBuilder.group({
            name: [null, [Validators.required]],
            groupId: [null, [Validators.required]],
        });

        this._categoryService.categoryGroups$.subscribe(categoryGroups => {
            this.categoryGroup = categoryGroups;
        })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    onSelectFile(event: any) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Chỉ lưu trữ ảnh đầu tiên trong mảng hoặc biến
                this.selectedImage = event.target.files[0];
                this.objectURL = URL.createObjectURL(event.target.files[0]);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    onSubmit() {
        const formData = new FormData();

        formData.append(`thumbnail`, this.selectedImage);
        formData.append(`name`, this.createCategoryForm.controls['name'].value);
        formData.append(`groupId`, this.createCategoryForm.controls['groupId'].value);

        // Gửi biểu mẫu dưới dạng multipart/form-data
        this._categoryService.createCategory(formData).subscribe(result => {
            if (result) {
                this.matDialogRef.close();
            }
        });
    }

    onCategoryChange(event: any) {
        this.createCategoryForm.controls['groupId'].setValue(event);
    }

    /**
     * Save and close
     */
    saveAndClose(): void {
        // Save the message as a draft
        this.saveAsDraft();

        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Discard the message
     */
    discard(): void {
    }

    /**
     * Save the message as a draft
     */
    saveAsDraft(): void {
    }

    /**
     * Send the message
     */
    send(): void {
    }
}
