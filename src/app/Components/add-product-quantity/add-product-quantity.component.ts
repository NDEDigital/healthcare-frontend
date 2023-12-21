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
  dropdown_ProductName: string = "Product Name"; // Set an initial value
  selectedProductNames: string[] = []; // Initialize an array to hold selected product names for each row

  selectedProduct :any;
  masterForm: FormGroup;
  form!: FormGroup;
  productDertailsData:any;
  masterdata: any;
 
 
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
      productName: [''],
      productId: [''],
      productGroupId: [''],
 
      specification: [''],
      unit: [''],
      unitId: [''],
      price: [''],
      receiveQty: [''],
      availableQty: [''],
      Remarks: [''],
      isDropdownOpen: [false], // Ensure isDropdownOpen is initialized for each row
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
  // submit() {
  //   this.masterdata = {
  //     PortalReceivedCode: this.masterForm.value.portalReceivedCode,
  //     PortalReceivedDate: this.masterForm.value.portalReceivedDate,
  //     ChallanNo: this.masterForm.value.challanNo,
  //     ChallanDate: this.masterForm.value.challanDate,
  //     Remarks: this.masterForm.value.remarks,
  //   };
  //   console.log(" masterdata", this.masterdata)
  //   const formData = this.form.value;
  //   console.log(" detailsdata ",formData);
  //   // Access the values from the FormArray
   
  // }

  submit() {
    const formData = this.form.value;
    console.log("formData", formData)
  
    this.masterdata = {
      portalReceivedCode: this.masterForm.value.portalReceivedCode,
      portalReceivedDate: this.masterForm.value.portalReceivedDate,
      challanNo: this.masterForm.value.challanNo,
      challanDate: this.masterForm.value.challanDate,
      remarks: this.masterForm.value.remarks,
      userId: 1,
      companyCode: "CMP-23-0009",
      addedBy: "string",
      addedPC: "string",
      portalReceivedDetailslist: formData.rows.map((row: any) => ({
        productGroupId:row.productId, // Replace with appropriate values
        productId: row.productId, // Replace with appropriate values
        specification: row.specification,
        receivedQty: parseInt(row.receiveQty, 10),
        unitId: parseInt(row.unitId, 10),
        price: row.price,
        totalPrice: parseInt(row.receiveQty, 10) * row.price,
        userId: 2, // Replace with appropriate values
        addedBy: "string",
        addedPC: "string"
      }))
    };
  
    console.log("masterdata", this.masterdata);
    // Call a service method to submit data to an API or perform further actions
  }
  

  // Inside your component class
isDropdownVisible(rowIndex: number): boolean {
  const rowGroup = this.rowsFormArray.at(rowIndex) as FormGroup;
  const isDropdownOpen = rowGroup.get('isDropdownOpen');
  return isDropdownOpen?.value === true;
}


  toggleDropdown( rowIndex: number): void {
    // Close all dropdowns
    for (let i = 0; i < this.rowsFormArray.length; i++) {
      if (i !== rowIndex) {
        const rowGroup = this.rowsFormArray.at(i) as FormGroup;
        rowGroup.patchValue({ isDropdownOpen: false });
      }
    }
  
    // Toggle the dropdown for the clicked row
    const rowGroup = this.rowsFormArray.at(rowIndex) as FormGroup;
    const currentValue = rowGroup.get('isDropdownOpen')?.value || false;
    rowGroup.patchValue({ isDropdownOpen: !currentValue });
    this.getDetailsData();
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
    
    const rowGroup = this.rowsFormArray.at(rowIndex) as FormGroup;
    rowGroup.patchValue({
      productName: selectedItem.productName,
      productId:selectedItem.productId,
      productGroupId:selectedItem.productGroupId,
      specification: selectedItem.specification,
      unit: selectedItem.unit,
      unitId: selectedItem.unitId,
      price: selectedItem.price,
      receiveQty:'',
      availableQty: selectedItem.availableQty,
      Remarks: '',
    });
  
    this.selectedProductNames[rowIndex] = selectedItem.productName; // Store selected product name for this row
  }
  
  
  
}
