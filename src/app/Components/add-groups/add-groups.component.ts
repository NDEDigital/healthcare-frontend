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
  @ViewChild('addGroupModalCenterG') AddGroupModalCenterG!: ElementRef;
  @ViewChild('modalGroupImage') modalGroupImage!: ElementRef<HTMLImageElement>;

  addGroupForm!: FormGroup;
  alertMsg = '';
  showProductDiv: boolean = false;
  groupList: any;
  btnIndex = -1;
  isError: boolean = false;
  isEditMode = false;
  existingImagePath: string = '';
  currentGroup: any = null;
  activeGroupId: number | null = null;

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

      // formData.append(
      //   'imageFile',
      //   this.ProductImageInput.nativeElement.files[0]
      // );

      if (this.ProductImageInput.nativeElement.files[0]) {
        // If a new file is selected, append it
        formData.append(
          'imageFile',
          this.ProductImageInput.nativeElement.files[0]
        );
      } else if (this.isEditMode && this.existingImagePath) {
        // If in edit mode and no new file is selected, append the existing image path
        formData.append('existingImagePath', this.existingImagePath);
      }

      // Append additional fields
      formData.append('addedBy', 'user');
      formData.append('addedPC', '0.0.0.0');

      for (let pair of (formData as any).entries()) {
        console.log(`${pair[0]}: `, pair[1]);
      }
      if (!this.isEditMode) {
      this.addProductService.createProductGroup(formData).subscribe({
        next: (response: any) => {
          //console.log(response, 'successfull');
          this.alertMsg = response.message;
          this.isError = false;
          //console.log(response.message);
          setTimeout(() => {
            this.UserExistModalBTN.nativeElement.click();
            this.addGroupForm.reset();
           // this.toggleAddProductGroupDiv();
          }, 50);


        },
        error: (error: any) => {
          //console.log(error, 'error');
          this.alertMsg = error.error.message;
          this.isError = true;
          this.UserExistModalBTN.nativeElement.click();
        },
      });
    }
      // console.log(this.isEditMode, "inserting on submit");


      if (this.isEditMode) {

        let updateByUser = localStorage.getItem('code');
        console.log(updateByUser, 'code...');

        // console.log("edit mode");
        formData.append('ProductGroupID', this.currentGroup.productGroupID);
        if (updateByUser !== null) {
          formData.append('UpdatedBy', updateByUser);
        } else {
          console.error('Update by code not found in localStorage');
        }
        formData.append('UpdatedPC', '0.0.0.0');
        this.addProductService.updateProductGroup(formData).subscribe({
          next: (response: any) => {
            // Handle successful response here
            console.log('Update successful:', response);
            this.alertMsg = 'Product group updated successfully';
            this.isEditMode = false;
            // Optionally, reset the form and refresh the group list
            this.addGroupForm.reset();
            this.getProductGroup(-1);

            // Close the modal if you have one open
            this.UserExistModalBTN.nativeElement.click();

          },
          error: (error: any) => {
            // Handle error response here
            console.error('Error updating product group:', error);
            this.alertMsg =
              error.error.message || 'Error updating product group';
            this.isError = true;
            this.isEditMode = false;

            // Show the error modal or message
            this.UserExistModalBTN.nativeElement.click();
          },
        });
        console.log(this.isEditMode, "updating on submit");
      }
    } else {
      console.log('Form is not valid');
    }
  }

  getProductGroup(status: any) {
    this.addProductService.GetProductGroupsListByStatus(status).subscribe({
      next: (response: any) => {
        console.log(response);
        this.groupList = response;
      },
      error: (error: any) => {
        //console.log(error);
        this.alertMsg = error.error.message;
        this.UserExistModalBTN.nativeElement.click();
      },
    });
  }

  updateFormValidators(): void {
    // Check if the control exists
    const productGroupImageControl = this.addGroupForm.get('productGroupImage');
    if (productGroupImageControl) {
      if (this.isEditMode) {
        productGroupImageControl.clearValidators();
      } else {
        productGroupImageControl.setValidators(Validators.required);
      }
      productGroupImageControl.updateValueAndValidity();
    }
  }

  openModalWithData(group: any): void {

    this.isEditMode = true;
    this.updateFormValidators();
    console.log('group', group);
    this.populateForm(group);
    this.currentGroup = group;

    // Ensure the modal is opened before calling displayImage
    this.AddGroupModalCenterG.nativeElement.click();
    this.displayImage(group.imagepath);
    this.activeGroupId = group.productGroupID;
  }
  populateForm(group: any): void {
    this.addGroupForm.patchValue({
      productGroupName: group.productGroupName,
      productGroupPrefix: group.productGroupPrefix,
      productGroupDetails: group.productGroupDetails,
    });

    this.displayImage(group.imagepath);
    this.existingImagePath = group.imagepath;
  }

  displayImage(imagePath: string): void {
    if (this.modalGroupImage && this.modalGroupImage.nativeElement) {
      if (imagePath) {
        const imageUrl = '/asset' + imagePath.split('asset')[1];
        this.modalGroupImage.nativeElement.src = imageUrl;
      } else {
        this.modalGroupImage.nativeElement.src = '';
      }
    }
  }
}
