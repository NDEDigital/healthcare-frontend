import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AddProductService } from 'src/app/services/add-product.service';

@Component({
  selector: 'app-add-groups',
  templateUrl: './add-groups.component.html',
  styleUrls: ['./add-groups.component.css'],
})
export class AddGroupsComponent {
  @ViewChild('userExistModalBTN') UserExistModalBTN!: ElementRef;
  @ViewChild('productGroupImageInput') ProductImageInput!: ElementRef;

  addGroupForm!: FormGroup;
  alertMsg = '';
  showProductDiv: boolean = false;
  groupList: any;
  btnIndex = -1;
  isError: boolean = false;
  constructor(private addProductService: AddProductService) {}

  toggleAddProductGroupDiv(): void {
    this.showProductDiv = !this.showProductDiv;
    this.btnIndex = -1;
    this.getProductGroup(-1);
    this.ngOnInit();
  }

  showApprovalProductGrid(): void {
    this.showProductDiv = false;
    this.addGroupForm.reset();
  }

  ngOnInit() {
    this.addGroupForm = new FormGroup({
      productGroupName: new FormControl('', Validators.required),
      productGroupImage: new FormControl('', Validators.required),
      productGroupPrefix: new FormControl('', Validators.required),
      productGroupDetails: new FormControl(''),
    });
    this.getProductGroup(-1);
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addGroupForm.get(fieldName);
    // Check if the field is not null before accessing its properties
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  resetForm(): void {
    this.addGroupForm.reset();
  }

  onSubmit(): void {
    Object.values(this.addGroupForm.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });
    // const formData = {
    //   ...this.addGroupForm.value,
    //   addedBy: 'user',
    //   addedPC: '0.0.0.0',
    // };
    if (this.addGroupForm.valid) {
      // //console.log('Form Data:', this.addGroupForm.value);
      const formData = new FormData();

      Object.keys(this.addGroupForm.value).forEach((key) => {
        let value = this.addGroupForm.value[key];
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

      this.addProductService.createProductGroup(formData).subscribe({
        next: (response: any) => {
          //console.log(response, 'successfull');
          this.alertMsg = response.message;
          this.isError = false;
          //console.log(response.message);
          setTimeout(() => {
            this.UserExistModalBTN.nativeElement.click();
            this.addGroupForm.reset();
            this.toggleAddProductGroupDiv();
          }, 50);
        },
        error: (error: any) => {
          //console.log(error, 'error');
          this.alertMsg = error.error.message;
          this.isError = true;
          this.UserExistModalBTN.nativeElement.click();
        },
      });
    } else {
      //console.log('Form is not valid');
    }
  }

  getProductGroup(status: any) {
    this.addProductService.GetProductGroupsListByStatus(status).subscribe({
      next: (response: any) => {
        //console.log(response);
        this.groupList = response;
      },
      error: (error: any) => {
        //console.log(error);
        this.alertMsg = error.error.message;
        this.UserExistModalBTN.nativeElement.click();
      },
    });
  }
}
