import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Component } from '@angular/core';

@Component({
  selector: 'app-add-product-quantity',
  templateUrl: './add-product-quantity.component.html',
  styleUrls: ['./add-product-quantity.component.css']
})
export class AddProductQuantityComponent {
  isGoodsNameDropdownOpen: boolean = false
  isGroupNameDropdownOpen: boolean = false
  dropdown_groupName  = "groupnmae"
  dropdown_goodsName = " goodsNmae"
  masterForm: FormGroup;
  form!: FormGroup;
  masterdata: any;
  dropdownItems: string[] = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  constructor(private fb: FormBuilder) {
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
      // Define the form controls for each row
      productName: [''],
      ProductGroupCode: [''],
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
    const formData = this.form.value;
    console.log(formData);
    // Access the values from the FormArray
   
  }


  toggleDropdown(type: string): void {
    this.isGroupNameDropdownOpen = (type === 'groupName') ? !this.isGroupNameDropdownOpen : false;
    this.isGoodsNameDropdownOpen = (type !== 'groupName') ? !this.isGoodsNameDropdownOpen : false;
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
  
  SetDropDownName(groupName : string){
    this.dropdown_groupName = groupName
  }



}
