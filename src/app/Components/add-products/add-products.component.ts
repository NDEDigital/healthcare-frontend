import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddProductService } from 'src/app/services/add-product.service';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css'],
})
export class AddProductsComponent implements OnInit {
  addProductForm!: FormGroup;
  productGroups: any[] = [];
  units: any[] = [];

  constructor(private productService: AddProductService) {}

  ngOnInit() {
    this.addProductForm = new FormGroup({
      productGroupID: new FormControl('', Validators.required),
      productName: new FormControl('', Validators.required),
      productSubName: new FormControl(''),
      specification: new FormControl('', Validators.required),
      unitId: new FormControl('', Validators.required),
      imageFile: new FormControl('', Validators.required),
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
      console.log('Form Data:', this.addProductForm.value);
    } else {
      console.log('Form is not valid');
    }
  }
}
