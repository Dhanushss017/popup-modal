import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-popup',
  templateUrl: './modal-popup.component.html',
  styleUrls: ['./modal-popup.component.css'],
})
export class ModalPopupComponent {
  freshList = ['Newly Arrived', 'Used', 'Refurbished'];
  productForm!: FormGroup;
  actionBtn: string = 'Save';
  constructor(
    private formbuilder: FormBuilder,
    private api: ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<ModalPopupComponent>
  ) {}
  ngOnInit(): void {
    this.productForm = this.formbuilder.group({
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshList: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date: ['', Validators.required],
    });
    if (this.editData) {
      this.actionBtn = 'Update';
      this.productForm.controls['productName'].setValue(
        this.editData.productName
      );
      this.productForm.controls['category'].setValue(this.editData.category);

      this.productForm.controls['freshList'].setValue(this.editData.freshList);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.productForm.controls['date'].setValue(this.editData.date);
    }
  }
  addProduct() {
    if (this.productForm.valid) {
      if (!this.editData) {
        this.api.postProduct(this.productForm.value).subscribe({
          next: (res) => {
            this.handleSuccess('Product added successfully', 'save');
          },
          error: () => {
            this.handleError('Error while adding the product');
          },
        });
      } else {
        
        this.api.putProduct(this.productForm.value, this.editData.id).subscribe({
          next: (res) => {
            this.handleSuccess('Product updated successfully', 'update');
          },
          error: () => {
            this.handleError('Error while updating the product');
          },
        });
      }
    } else {
      
    }
  }
  
  private handleSuccess(message: string, action: string) {
    alert(message);
    this.productForm.reset();
    this.dialogRef.close(action);
  }
  
  private handleError(errorMessage: string) {
    alert(errorMessage);
  }
  
}
