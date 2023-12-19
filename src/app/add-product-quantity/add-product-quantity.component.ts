 
import {
  FormGroup,
  ValidationErrors,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { Component, Renderer2, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-add-product-quantity',
  templateUrl: './add-product-quantity.component.html',
  styleUrls: ['./add-product-quantity.component.css']
})
export class AddProductQuantityComponent {
  @ViewChild('tableRow', { static: false }) tableRow!: ElementRef;
  userForm: FormGroup;
  isGroupNameDropdownOpen: boolean = false;
  isGoodsNameDropdownOpen: boolean = false;
  rows: any[] = []; // Array to hold table rows

  dropdownItems: string[] = ['About', 'Base', 'Blog', 'Contact', 'Custom', 'Support', 'Tools'];
  dropdown_groupName ="Select GroupName"
  dropdown_goodsName ="Select GoodsName"
  tableData: any[] = [
    { portalDetailsCode: 'Code1', /* Other properties... */ },
    { portalDetailsCode: 'Code2', /* Other properties... */ },
    // Other existing rows...
  ];

 
constructor(
  private renderer: Renderer2
) {
  
  this.userForm = new FormGroup(
    {
      trade: new FormControl('Buyer', Validators.required),
      fullName: new FormControl('', Validators.required),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
        Validators.minLength(11),
        Validators.maxLength(11),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(15),
      ]),
      confirmPassword: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      address: new FormControl(''),
      companyName: new FormControl(''),
      website: new FormControl(''),
      productCategory: new FormControl('Nothing Selected'),
      companyFoundationDate: new FormControl(''),

      businessRegNum: new FormControl(''),
      taxIdNum: new FormControl(''),

      // payment
      prefPaymentMethod: new FormControl('Nothing Selected'),
      //bank
      bankId: new FormControl(''),
      bankAccountNo: new FormControl(''),
      bankHolderName: new FormControl(''),
      // mbl
      MobileBankingTypeId: new FormControl(''),
      MobileBankingNo: new FormControl(''),
    }
    
  );
}

addRow() {
  this.rows.push({});
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
