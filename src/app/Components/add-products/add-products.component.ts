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

  addProductForm!: FormGroup;
  productGroups: any[] = [];
  units: any[] = [];
  alertMsg: string = '';
  isError: boolean = false;

  constructor(private productService: AddProductService) {}

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
  }


  

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addProductForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getProductGroups() {
    this.productService.getProductGroups().subscribe(
      (data: any) => {
        this.productGroups = data;
        console.log('Product Groups:', this.productGroups);
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
        console.log('unit Groups:', this.units);
      },
      (error) => {
        console.error('Error fetching product groups:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.addProductForm.valid) {
      // Create FormData object
      const formData = new FormData();


      Object.keys(this.addProductForm.value).forEach((key) => {
        let value = this.addProductForm.value[key];
        if (key === 'productId' || key === 'unitId') {
          
          value = String(Math.floor(Number(value)));
          console.log(value);

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
        console.log(`${pair[0]}: `, pair[1]);
      }


      this.productService.createProductList(formData).subscribe({
        next: (response: any) => {
          console.log(response);
          this.alertMsg = response.message;
          this.isError = false; // Set isError to false for a success message
          this.PrdouctExistModalBTN.nativeElement.click();
          this.addProductForm.reset();
        },
        error: (error: any) => {
          console.log(error);
          this.alertMsg = error.error.message;
          this.isError = true; // Set isError to true for an error message
          this.PrdouctExistModalBTN.nativeElement.click();
        },
      });
    } else {
      console.log('Form is not valid');
    }
  }



}
