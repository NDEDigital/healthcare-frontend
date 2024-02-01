import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddProductService } from 'src/app/services/add-product.service';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css'],
})
export class AddProductsComponent implements OnInit {
  @ViewChild('ProductImageInput') ProductImageInput!: ElementRef;
  @ViewChild('prdouctExistModalBTN') PrdouctExistModalBTN!: ElementRef;
  @ViewChild('addProductModalCenterG') AddProductModalCenterG!: ElementRef;

  addProductForm!: FormGroup;
  productGroups: any[] = [];
  units: any[] = [];
  alertMsg: string = '';
  isError: boolean = false;
  showProductDiv: boolean = false;
  productList: any;
  btnIndex = -1;
  isHovered: any | null = null;

  isEditMode = false;
  activeProductId: number | null = null;
  currentProduct: any = null;
  existingImagePath: string = '';
  imagePathPreview: string = '';

  constructor(private productService: AddProductService) {}

  toggleAddProductDiv(): void {
    this.showProductDiv = !this.showProductDiv;
    this.btnIndex = -1;
    this.getProducts(-1);
    this.ngOnInit();
  }

  showApprovalGrid(): void {
    this.showProductDiv = false;
    this.addProductForm.reset();
  }

  ngOnInit() {
    this.addProductForm = new FormGroup({
      productGroupID: new FormControl('', Validators.required),
      productName: new FormControl('', Validators.required),
      productSubName: new FormControl(''),
      specification: new FormControl('', Validators.required),
      unitId: new FormControl('', Validators.required),
      productImage: new FormControl('', Validators.required),
    });

    // Fetch product groups when the component is initialized
    this.getProductGroups();
    this.getUnit();
    this.getProducts(-1);
  }
  openAddProductModal(): void {
    this.resetForm();
    this.isEditMode = false;
    this.currentProduct = null;
    this.AddProductModalCenterG.nativeElement.click();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addProductForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  resetForm(): void {
    this.addProductForm.reset();
    this.isEditMode = false;
    this.currentProduct = null;
    this.activeProductId = null;
  }

  getProductGroups() {
    this.productService.getProductGroups().subscribe(
      (data: any) => {
        this.productGroups = data;
        //console.log('Product Groups:', this.productGroups);
      },
      (error) => {
        console.error('Error fetching product groups:', error);
      }
    );
  }

  getUnit() {
    this.productService.getUnitGroups().subscribe(
      (data: any) => {
        this.units = data;
        //console.log('unit Groups:', this.units);
      },
      (error) => {
        console.error('Error fetching product groups:', error);
      }
    );
  }

  onSubmit(): void {
    Object.values(this.addProductForm.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });

    if (this.addProductForm.valid) {
      // Create FormData object
      const formData = new FormData();

      Object.keys(this.addProductForm.value).forEach((key) => {
        let value = this.addProductForm.value[key];
        if (key === 'productId' || key === 'unitId') {
          value = String(Math.floor(Number(value)));
          //console.log(value);
        }
        formData.append(key, value);
      });

      formData.append(
        'imageFile',
        this.ProductImageInput.nativeElement.files[0]
      );

      // Append additional fields
      formData.append('addedBy', 'user');
      formData.append('addedPC', '0.0.0.0');

      for (let pair of (formData as any).entries()) {
        //console.log(`${pair[0]}: `, pair[1]);
      }
      
      if (!this.isEditMode) {
        this.productService.createProductList(formData).subscribe({
          next: (response: any) => {
            //console.log(response);
            this.alertMsg = response.message;
            this.isError = false; // Set isError to false for a success message
            setTimeout(() => {
              this.PrdouctExistModalBTN.nativeElement.click();
              this.addProductForm.reset();
              this.toggleAddProductDiv();
            }, 50);
            this.getProducts(-1);
          },
          error: (error: any) => {
            //console.log(error);
            this.alertMsg = error.error.message;
            this.isError = true; // Set isError to true for an error message
            this.PrdouctExistModalBTN.nativeElement.click();
          },
        });
      }

      if (this.isEditMode) {
        console.log('this.isEditMode: ', this.isEditMode);

        let updateByUser = localStorage.getItem('code');
        console.log(updateByUser, 'code...');
        formData.append('ProductId', this.currentProduct.productId);
        if (updateByUser !== null) {
          formData.append('UpdatedBy', updateByUser);
        } else {
          console.error('Update by code not found in localStorage');
        }
        formData.append('UpdatedPC', '0.0.0.0');

        // Your logic to handle form submission in edit mode
        // ...

        this.productService.updateProductList(formData).subscribe({
          next: (response: any) => {
            // Handle successful response here
            console.log('Update successful:', response);
            this.alertMsg = 'Product  updated successfully';
            this.isEditMode = false;
            // Optionally, reset the form and refresh the group list
            this.addProductForm.reset();
            this.getProducts(-1);

            // Close the modal if you have one open
            this.PrdouctExistModalBTN.nativeElement.click();
          },
          error: (error: any) => {
            // Handle error response here
            console.error('Error updating product :', error);
            this.alertMsg = error.error.message || 'Error updating product';
            this.isError = true;
            this.isEditMode = false;

            // Show the error modal or message
            this.PrdouctExistModalBTN.nativeElement.click();
          },
        });
      }
    } else {
      console.log('form is not valid');
    }
  }

  getProducts(status: any) {
    this.productService.GetProductListByStatus(status).subscribe({
      next: (response: any) => {
        console.log(response);
        this.productList = response;
      },
      error: (error: any) => {
        //console.log(error);
        this.alertMsg = error.error.message;
      },
    });
  }

  updateFormValidators(): void {
    // Check if the control exists
    const productImageControl = this.addProductForm.get('productImage');
    if (productImageControl) {
      if (this.isEditMode) {
        productImageControl.clearValidators();
      } else {
        productImageControl.setValidators(Validators.required);
      }
      productImageControl.updateValueAndValidity();
    }
  }

  openModalWithData(product: any): void {
    this.isEditMode = true;
    this.updateFormValidators();
    console.log('productId', product);
    this.populateForm(product);
    this.currentProduct = product;

    //Ensure the modal is opened before calling displayImage

    this.displayImage(product.imagePath);
    this.activeProductId = product.productId;
  }

  populateForm(product: any): void {
    this.addProductForm.patchValue({
      productGroupID: product.productGroupID,
      productName: product.productName,
      productSubName: product.productSubName,
      specification: product.specification,
      unitId: product.unitId,
    });

    this.displayImage(product.imagePath);
    this.existingImagePath = product.imagePath;
  }

  displayImage(imagePath: string): void {
    console.log('Received imagePath:', imagePath);

    if (imagePath) {
      const imageUrl = '/asset' + imagePath.split('asset')[1];

      console.log('Constructed imageUrl:', imageUrl);
      this.imagePathPreview = imageUrl;
    } else {
      this.imagePathPreview = 'not upload yet';
    }
    this.AddProductModalCenterG.nativeElement.click();
  }

  updateIsActive(isActive: any, producID: any) {
    console.log(isActive, 'isActive', producID, 'productID');
    this.productService.updateProductStatus(producID, isActive).subscribe({
      next: (response: any) => {
        console.log(response);
        this.getProducts(isActive);
        this.btnIndex = isActive;
      },
      error: (error: any) => {
        //console.log(error);
        this.alertMsg = error.error.message;
      },
    });
  }
}
