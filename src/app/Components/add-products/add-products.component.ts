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
  @ViewChild('allselected', { static: false }) allSelectedCheckbox!: ElementRef<HTMLInputElement>;

  addProductForm!: FormGroup;
  productGroups: any[] = [];
  units: any[] = [];
  alertMsg: string = '';
  isError: boolean = false;
  showProductDiv: boolean = false;
  productList: any;
  btnIndex = -1;
  isHovered: any | null = null;
  alertTitle: string = '';

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

  selectedProducts1: any[] = [];
  getProducts(status: any) {
    this.selectAll=false;
    // this.selectedProducts1.length=0;
    this.productService.GetProductListByStatus(status).subscribe({
      next: (response: any) => {
        // console.log(response);
        this.productList = response;
    this.selectedProducts1.length=0;

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
    // console.log('productId', product);
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

    this.displayImage(product.imagepath);
    this.existingImagePath = product.imagepath;
  }

  displayImage(imagePath: string): void {
    // console.log('Received imagePath:', imagePath);

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
    // console.log("for type", typeof producID);

    // console.log(isActive, 'isActive', producID, 'productID');
    this.productService.updateProductStatus([producID], isActive).subscribe({
      next: (response: any) => {
        // console.log(response);
        this.getProducts(isActive);
        this.btnIndex = isActive;
        this.PrdouctExistModalBTN.nativeElement.click();
        this.alertMsg = isActive
          ? 'Product is  Activated!'
          : 'Product is Deactiveted!';
        this.alertTitle = isActive
          ? 'Activated!'
          : 'Deactiveted!';

      },
      error: (error: any) => {
        //console.log(error);
        this.alertMsg = error.error.message;
      },
    });
  }
  selectedProductIds: any[] = [];
  
  selectAll = false;
  toggleAllCheckboxes() {
    // console.log("all seelcted",)
    // console.log('Selected Product IDs:', this.selectedProducts1);
  

    // Toggle the state of all checkboxes based on the "Select All" checkbox
    this.productList.forEach(
      (product: { isSelected: boolean, productId: any }) => {
        product.isSelected = this.selectAll;
        
        // Update the selectedProducts array based on the state of each checkbox
        if (this.selectAll && !this.selectedProducts1.includes(product.productId)) {
          this.selectedProducts1.push(product.productId);
          
        }
        else if (!this.selectAll && this.selectedProducts1.includes(product.productId)) {
          // Remove the deselected product from the list
          this.selectedProducts1 = this.selectedProducts1.filter(
            (id) => id !== product.productId
          );
          // this.selectAll=false;
        
        }
        
      }
    );
   
    
    // console.log('Selected Product IDs:', this.selectedProducts1);
    // console.log("this.selectedProducts1.length",this.selectedProducts1.length);
    // console.log("this.selectedProducts1.length",this.productList.length);
  
  }
  chageActiveInactive(isActive:any){


 
    if(this.selectedProducts1.length>0){
      

      this.productService.updateProductStatus(this.selectedProducts1,isActive).subscribe({
        next: (response: any) => {
          // console.log(response);
          this.getProducts(isActive);
          this.btnIndex = isActive;
          this.PrdouctExistModalBTN.nativeElement.click();
          this.alertMsg = isActive
          ? 'Product is  Activated!'
          : 'Product is Deactiveted!';
        this.alertTitle = isActive
          ? 'Activated!'
          : 'Deactiveted!';
  //         this.selectAll = false;
  
           this.selectAll=false;
           this.selectedProducts1.length=0;
          // console.log("product id's are",this.selectedProductIds)
        },
        error: (error: any) => {
          //console.log(error);
          this.alertMsg = error.error.message;
        },
      });
    }
    else{
      this.PrdouctExistModalBTN.nativeElement.click();

      this.alertMsg='No Product is selected'
    }

  }

  checkboxSelected(productId: any, event: any) {
    const isSelected: boolean = event.target.checked;
// console.log(isSelected);
    if (isSelected && !this.selectedProducts1.includes(productId)) {
      // Add the selected product to the list
      this.selectedProducts1.push(productId);
    } else if (!isSelected && this.selectedProducts1.includes(productId)) {
      // Remove the deselected product from the list
      this.selectedProducts1 = this.selectedProducts1.filter(
        (id) => id !== productId
      );
    }
    this.allSelectedCheckbox.nativeElement.checked=false;
    // Update the selectedProductIds array with the current list of selected product IDs
    this.selectedProductIds = this.selectedProducts1.slice();
  if(this.selectedProducts1.length===this.productList.length){
  this.allSelectedCheckbox.nativeElement.checked=true;

}
 
  }
}
