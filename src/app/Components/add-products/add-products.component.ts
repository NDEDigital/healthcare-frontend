import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add-products',
  templateUrl: './add-products.component.html',
  styleUrls: ['./add-products.component.css']
})
export class AddProductsComponent {
  addProductForm!: FormGroup;  // Corrected the type to FormGroup

  constructor(){}

  ngOnInit() {
    this.addProductForm = new FormGroup({

      productGroup: new FormControl('', Validators.required),
      productName: new FormControl('', Validators.required),
      productSubName: new FormControl(''),
      specification: new FormControl('', Validators.required),
      unit: new FormControl('', Validators.required),
      productImg: new FormControl('', Validators.required),

    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addProductForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    if (this.addProductForm.valid) {
      console.log('Form Data:', this.addProductForm.value);
    } else {
      console.log('Form is not valid');
    }
  }

}
