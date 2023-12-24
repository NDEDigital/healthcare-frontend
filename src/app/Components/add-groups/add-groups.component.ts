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

  addGroupForm!: FormGroup;
  alertMsg = '';
  showProductDiv: boolean = false;

  constructor(private addProductService: AddProductService) {}


  toggleAddProductGroupDiv(): void {
    this.showProductDiv = !this.showProductDiv;
  }


  showApprovalProductGrid(): void {
    this.showProductDiv = false;
  }


  ngOnInit() {
    this.addGroupForm = new FormGroup({
      productGroupName: new FormControl('', Validators.required),
      productGroupPrefix: new FormControl('', Validators.required),
      productGroupDetails: new FormControl(''),
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addGroupForm.get(fieldName);
    // Check if the field is not null before accessing its properties
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit(): void {
    Object.values(this.addGroupForm.controls).forEach((control) => {
      control.markAsTouched();
      control.markAsDirty();
    });
    const formData = {
      ...this.addGroupForm.value,
      addedBy: 'user',
      addedPC: '0.0.0.0',
    };
    if (this.addGroupForm.valid) {
      console.log('Form Data:', this.addGroupForm.value);

      this.addProductService.createProductGroup(formData).subscribe({
        next: (response: any) => {
          console.log(response);
          this.addGroupForm.reset();
          this.alertMsg = 'Successfully added this Product Group';
          this.UserExistModalBTN.nativeElement.click();
        },
        error: (error: any) => {
          console.log(error);
          this.alertMsg = error.error.message;
          this.UserExistModalBTN.nativeElement.click();
        },
      });
    } else {
      console.log('Form is not valid');
    }
  }
}
