import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Component } from '@angular/core';
import { AddProductService } from 'src/app/services/add-product.service';

@Component({
  selector: 'app-add-product-quantity',
  templateUrl: './add-product-quantity.component.html',
  styleUrls: ['./add-product-quantity.component.css']
})
export class AddProductQuantityComponent {
  isGoodsNameDropdownOpen: boolean = false
  isGroupNameDropdownOpen: boolean = false
  dropdown_groupName: string = "Product Name"; // Set an initial value
  selectedProduct :any;
  masterForm: FormGroup;
  form!: FormGroup;
  productDertailsData:any;
  masterdata: any;
  products: any =  [
    { productId: 1, productName: 'Product A', productCode: 'PA001', availableQty: 50 },
    { productId: 2, productName: 'Product B', productCode: 'PB002', availableQty: 30 },
    { productId: 3, productName: 'Product C', productCode: 'PC003', availableQty: 20 },
    // Add more objects as needed
  ];
 
  constructor(private fb: FormBuilder , private addProductService :AddProductService) {
    this.masterForm = this.fb.group({
      portalReceivedCode: [''],
      portalReceivedDate: [''],
      challanNo: ['', Validators.required],
      challanDate: ['', Validators.required],
      remarks: [''],
    });

    
  }
 


  ngOnInit() {
    this.form = this.fb.group({
      rows: this.fb.array([])
    });
  }

  get rowsFormArray(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  addRow() {
    const newRow = this.fb.group({
      productName: ['Product Name'], // Initialize productName control
      specification: [''],
      unit: [''],
      price: [''],
      receiveQty: [''],
      availableQty: [''],
      Remarks: [''],
      // ... other fields
    });
  
    // Access the FormArray and push the new FormGroup
    (this.form.get('rows') as FormArray).push(newRow);
  }
  

  removeRow(index: number) {
    // Remove a specific row from the FormArray by index
    (this.form.get('rows') as FormArray).removeAt(index);
  }

  onSubmit() {
    // Access the form value, which contains multiple rows of data
    const formData = this.form.value;
    console.log(formData);
    // Process or submit the form data as needed
  }
  submit() {
    this.masterdata = {
      PortalReceivedCode: this.masterForm.value.portalReceivedCode,
      PortalReceivedDate: this.masterForm.value.portalReceivedDate,
      ChallanNo: this.masterForm.value.challanNo,
      ChallanDate: this.masterForm.value.challanDate,
      Remarks: this.masterForm.value.remarks,
    };
    console.log(" masterdata", this.masterdata)
    const formData = this.form.value;
    console.log(" detailsdata ",formData);
    // Access the values from the FormArray
   
  }


  toggleDropdown(type: string): void {
    this.isGroupNameDropdownOpen = (type === 'groupName') ? !this.isGroupNameDropdownOpen : false;
    if(this.isGroupNameDropdownOpen){
      this.getDetailsData();
    }
  }

  getDetailsData(){
    this.addProductService.GetProductDetailsData('CMP-23-0002') .subscribe({
      next: (response) => {
         console.log( response)
         this.productDertailsData = response;
         console.log("his.productDertailsData ",this.productDertailsData)
      },
      error: (error) => {
       console.log("error ",error)
      },
    });
  }
  filterFunction(event: Event , className: string): void {
    const input = (event.target as HTMLInputElement).value.toUpperCase();
    const links = document.querySelectorAll(className) as NodeListOf<HTMLAnchorElement>;
  
    links.forEach((a: HTMLAnchorElement) => {
      const txtValue = a.textContent || a.innerText || '';
      if (txtValue.toUpperCase().indexOf(input) > -1) {
        a.style.display = '';
      } else {
        a.style.display = 'none';
      }
    });
  }

  SetDropDownName(selectedItem: any, rowIndex: number) {
    this.selectedProduct = selectedItem;
    this.dropdown_groupName = selectedItem.productName;
    // Get the form control for the specified row index
    const rowGroup = this.rowsFormArray.at(rowIndex) as FormGroup;
    // Set the values for the specific row
    rowGroup.patchValue({
      productName: selectedItem.productName,
      specification: selectedItem.specification,
      unit: selectedItem.unit,
      price: selectedItem.productName,
      receiveQty:'',
      availableQty: selectedItem.availableQty,
      Remarks: '',
    });
  }
  
}
