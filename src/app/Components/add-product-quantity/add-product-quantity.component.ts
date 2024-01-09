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
  selectedGroup : any
  selectedProductGroup :string[] = [];
  masterForm: FormGroup;
  form!: FormGroup;
  productDertailsData:any;
  productGroupData : any
  portaldata: any;
  ProductGroupID:any;
  // ModalText = "Give some entry"
 
  constructor(private fb: FormBuilder , private addProductService :AddProductService) {
    this.masterForm = this.fb.group({
      portalReceivedCode: [''],
      portalReceivedDate: [''],
      challanNo: ['', Validators.required],
      challanDate: ['', Validators.required],
      remarks: [''],
    }); 
    this.form = this.fb.group({
      rows: this.fb.array([])
    });
  }
 


  ngOnInit() {

  

  }

 

  get rowsFormArray(): FormArray {
    return this.form.get('rows') as FormArray;
  }

  addRow() {
    const rowsArray = this.form.get('rows') as FormArray;
    
    if (rowsArray.length > 0) {
      const lastRow = rowsArray.at(rowsArray.length - 1) as FormGroup;
      if(!lastRow.valid){
        console.log(" sjgio")
      }
      // const controls = lastRow.controls;
      // const emptyFields = Object.keys(controls).filter(controlName => {
      //   const control = controls[controlName];
      //   return control.value === '' || control.value === null;
      // });
      
      // if (emptyFields.length > 0) {
      //   // Do something (alert, validation message, etc.) indicating there are empty fields.
      //   console.log('Previous row has empty fields');
      //   return; // Abort adding a new row
      // }
    }
  
    const newRow = this.fb.group({
   
      productName: ['', Validators.required],
      productId: [''],
      productGroupId: [''],
      specification: ['', Validators.required],
      unit: ['', Validators.required],
      unitId: [''],
      price: ['', Validators.required],
      receiveQty: ['', [Validators.required, Validators.pattern(/^-?\d+$/)]],
      availableQty: ['', Validators.required],
      remarks: [''],
      isDropdownOpen: [false],
      isGroDropdownOpen: [false],
      // ... other fields
    });
  
    rowsArray.push(newRow);
    this.selectedProductNames.push('Select product');
    this.selectedProductGroup.push('Select Group');
  }
  
 getPortalData(PortalReceivedId:any){
  this.addProductService.GetPortalData(PortalReceivedId).subscribe({
    next: (response) => {
      console.log('Response:', response);

    },
    error: (error) => {
      console.error('Error:', error);
      // Handle error
    }
  });

 }

  removeRow(index: number) {
    
    // Remove a specific row from the FormArray by index
    (this.form.get('rows') as FormArray).removeAt(index);

 
    const selectedProductNames = this.selectedProductNames;
    //console.log(" before selectedProductNames ",selectedProductNames)
    // Remove the corresponding selected product name from selectedProductNames array
    if (selectedProductNames[index]) {
      selectedProductNames.splice(index, 1);
      // You might need to update other indexes of selectedProductNames
      // if there are further changes to the array's indexes.
    }

    //console.log(" after selectedProductNames ",selectedProductNames)
    
  }

  onSubmit() {
    // Access the form value, which contains multiple rows of data
    const formData = this.form.value;
    //console.log(formData);
    // Process or submit the form data as needed
  }
  isFormValid(): boolean {
    return this.form.valid;
  }
  submit() {

    if (this.form.valid && this.rowsFormArray.length) {
 
   

      const formData = this.form.value;
   
      
    
      this.portaldata = {
        // portalReceivedCode: this.masterForm.value.portalReceivedCode,
        // portalReceivedDate: this.masterForm.value.portalReceivedDate,
        challanNo: this.masterForm.value.challanNo,
        remarks: this.masterForm.value.remarks,
        userId: localStorage.getItem('code'),
        companyCode: "CMP-23-0009",
        addedBy: "string",
        addedPC: "string",
        portalReceivedDetailslist: formData.rows.map((row: any) => ({
          productGroupId: row.productId,
          productId: row.productId,
          specification: row.specification,
          receivedQty: parseInt(row.receiveQty, 10),
          unitId: parseInt(row.unitId, 10),
          price: row.price,
          remarks: row.remarks,
          totalPrice: parseInt(row.receiveQty, 10) * row.price,
          userId: localStorage.getItem('code'),
          addedBy: "string",
          addedPC: "string"
        }))
      };
      
      // Check if challanDate exists and is not empty before adding it to portaldata
      if (this.masterForm.value.challanDate) {
        this.portaldata.challanDate = this.masterForm.value.challanDate;
      } 
      // API call
      this.addProductService.insertPortalReceived(this.portaldata).subscribe({
        next: (response) => {
          console.log('Response:', response);
          // Handle success response
          this.masterForm.reset(); // Reset the masterForm
          this.form.reset(); // Reset the nested form (rows)
          this.getPortalData(response.portalReceivedId)
          this.PatchForm(response);
          // while (this.rowsFormArray.length > 0) {
          //   this.removeRow(0);
          //   this.selectedProductNames=[] // clearing the array
          // }
        },
        error: (error) => {
          console.error('Error:', error);
          // Handle error
        }
      });
      // Further submission logic here
    }
    else {
      //console.log(" form invalid")
    }    
  }
  
   PatchForm(data : any){

    // master data
    this.masterForm.patchValue({

      challanNo: data.challanNo,
      remarks: data.remarks,
      portalReceivedCode: data.portalReceivedCode,
      portalReceivedDate: data.portalReceivedDate,
      challanDate: data.challanDate ? data.challanDate.split('T')[0] : null,


    });
 // Details data
 const detailsFormArray = this.form.get('rows') as FormArray; // Assuming 'rows' is your form array name

 detailsFormArray.clear(); // Clear previous entries if needed

 for (const detail of data.portalReceivedDetailslist) {
   detailsFormArray.push(this.fb.group({
     productId: detail.productId,
     productName: detail.productName,
     productGroupId: detail.productGroupId,
     specification: detail.specification,
     unit: detail.unit,
     unitId: detail.unitId,
     price: detail.price,
     receiveQty: detail.receivedQty,
     availableQty: detail.availableQty,
     remarks: detail.remarks,
   }));
 }

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

    const userID = localStorage.getItem('code')
    if( this.ProductGroupID && userID){
      this.addProductService.GetProductDetailsData(userID,this.ProductGroupID) .subscribe({
        next: (response) => {
           //console.log( response)
           this.productDertailsData = response;
           //console.log("his.productDertailsData ",this.productDertailsData)
        },
        error: (error) => {
         //console.log("error ",error)
        },
      });
    }

  }
  getGroupName(){
    const userID = localStorage.getItem('code')
    this.addProductService.getProductGroupsByUserId(userID).subscribe({
      next: (response) => {
         console.log( response)
       this.productGroupData = response;
         //console.log("his.productDertailsData ",this.productDertailsData)
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

  SetDropDownGroupName(selectedItem: any, rowIndex: number){
    this.selectedProductGroup[rowIndex] = selectedItem.productGroupName; // Store selected product name for this row
    this.ProductGroupID = selectedItem.productGroupID;
    // reseting the  row if group name is changed
    const row = this.rowsFormArray.at(rowIndex) as FormGroup;
    row.reset();

    // reseting the product name 

    this.selectedProductNames[rowIndex] ="Select Product"

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
      remarks: '',
    });
  
    this.selectedProductNames[rowIndex] = selectedItem.productName; // Store selected product name for this row
    //console.log(" product name ",    this.selectedProductNames)
  }
  
  getEmptyFields(): string[] {
    const emptyFields: string[] = [];
  
    // Loop through the form controls or rows in the form array
    const formRows = (this.form.get('rows') as FormArray).controls;
    formRows.forEach((row, index) => {
      const receiveQtyControl = row.get('receiveQty');
  
      // Check if the receiveQty field is empty or invalid
      if (!receiveQtyControl?.value) {
        emptyFields.push(`Receive Qty in row ${index + 1}`);
      }
      // Check other fields in a similar manner
    });
  
    return emptyFields;
  }
  clear()
{
  this.masterForm.reset(); // Reset the masterForm
  this.form.reset(); // Reset the nested form (rows)
 
  while (this.rowsFormArray.length > 0) {
    this.removeRow(0);
    this.selectedProductNames=[] // clearing the  product array
    this.selectedProductGroup   = [];
  }
}
}
