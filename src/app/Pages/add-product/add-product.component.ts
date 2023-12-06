import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { DashboardComponent } from '../dashboard/dashboard.component';
import { SharedService } from 'src/app/services/shared.service';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { DashboardDataService } from 'src/app/services/dashboard-data.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent {
  @ViewChild('imageInput') imageInput!: ElementRef;
  products = new Map();
  goods: any;
  imagePreview: string | undefined;
  productForm: FormGroup;
  imageFileName: string | undefined;
  isFormValid = false;
  publicIP = '0.0.0.0';
  product: any;
  editMode = false;
  headerTitle = 'Add Product';
  submitBtnTitle = 'Submit';
  selectedMaterial = '';
  MAX_FILE_SIZE_BYTES = 4194304; // 4MB = 1024 * 1024 * 4 bytes
  imageSizeExceeded = false;
  formData = new FormData();
  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private goodsData: GoodsDataService,
    private dashboardData: DashboardDataService
  ) 
  {
    this.productForm = new FormGroup({
      productName: new FormControl(''),
      productDescription: new FormControl(''),
      image: new FormControl(''),
      material: new FormControl(''),
      price: new FormControl(''),
      quantity: new FormControl(''),
      quantityUnit: new FormControl('Piece'),
    });

    this.productForm.valueChanges.subscribe(() => {
      this.isFormValid = this.productForm.valid;
    });

    fetch('https://api.ipify.org?format=json')               
      .then((response) => response.json())
      .then((data) => {
        this.publicIP = data.ip;
      
      });
    const productData = sessionStorage.getItem('editData');
    if (productData) {
      this.product = JSON.parse(productData);
   
      if (this.product != undefined) this.editMode = true;
    }
   
  }

  ngOnInit() {
    this.loadData();
    if (this.editMode) {
      this.headerTitle = 'Update Product';
      this.submitBtnTitle = 'Update';
      this.setValues();
      this.productForm.get('material')?.disable();
      this.selectedMaterial = this.product.groupCode;
    } else {
      setTimeout(() => {
        this.selectedMaterial = [...this.products.values()][0];
      }, 50);
    }

    // setTimeout(() => {
    //   this.selectedMaterial = [...this.products.values()][0];
    //   console.log(this.selectedMaterial, 'selectedMaterial');
    // }, 50);
  }

  loadData(): void {
    this.goodsData.getNavData().subscribe((data: any[]) => {
   
      this.goods = data;
      for (let i = 0; i < this.goods.length; i++) {
        this.products.set(this.goods[i].groupName, this.goods[i].groupCode);
      }
      if (this.products && this.products.size > 0) {
        // Get the first product key and value
        const firstValue = this.products.entries().next().value;
        const defaultMaterialKey = firstValue[0];
        const defaultMaterialValue = firstValue[1];
        const materialControl = this.productForm.get('material');
       
         
        // Check if the material control exists and then set the value
        if (materialControl) {
          materialControl.setValue(defaultMaterialValue + '%' + defaultMaterialKey);
        }
       
     
        // Set the default dropdown value
        // this.productForm.get('material').setValue(defaultMaterialValue + '%' + defaultMaterialKey);
      }
    });
  }
  onSubmit() {
    if (this.editMode) {
      this.updateProduct();
    } else {
      this.addProduct();
    }
  }
  setValues() {
    console.log(this.product.groupName);
    const materialValue = 
    this.product.groupCode + '%' + this.product.groupName;
    console.log(materialValue, 'materialValue');

    this.productForm.patchValue({
      productName: this.product.goodsName,
      productDescription: this.product.specification,
      material: this.product.groupCode + '%' + this.product.groupName,
      price: this.product.price,
      quantity: this.product.approveSalesQty,
      quantityUnit: this.product.quantityUnit,
  
    });
    this.productForm.get('image')?.disable();
  }
  updateProduct() {
    console.log('update callde');
    this.addFormData();
    this.formData.append('Status', 'edited');
    this.formData.append('StatusBit', '4');
    this.formData.append('UpdatedPc', this.publicIP);
    this.formData.append('GoodsId', this.product.goodsId);
    console.log('FormData inside Update:');
    this.formData.forEach((value, key) => {
      console.log(key, value);
    });

    if (this.isFormValid) {
      this.dashboardData.updateProduct(this.formData).subscribe({
        next: (response) => {
          console.log('Product Updated successfully', response);
          this.productForm.reset();
          this.imagePreview = '';
          window.location.href = '/dashboard';
        },
        error: (error) => {
          console.error('Error', error);
        },
      });
    }
  }
  addProduct() {
    this.addFormData();
    
    this.formData.append('Status', 'new');
    this.formData.append('Image', this.imageInput.nativeElement.files[0]);
    this.formData.append('ImageName', this.imageFileName || '');
    this.formData.append('AddedPc', this.publicIP);
    this.formData.append('UpdatedPc', this.publicIP);
    console.log('FormData inside Add:');
    this.formData.forEach((value, key) => {
      console.log(key, value);
    });
    if (this.isFormValid) {
    this.dashboardData.addProduct(this.formData).subscribe({
      next: (response) => {
        console.log('Product Added successfully', response);
        this.productForm.reset();
        this.imagePreview = '';
        this.productForm
          ?.get('material')
          ?.setValue([...this.products.values()][0]);

        this.productForm?.get('quantityUnit')?.setValue(['Ton']);
        window.location.href = '/dashboard';
      },
      error: (error) => {
        console.error('Error', error);
      },
    });
    }
  }

  addFormData() {
    const materialValue = this.productForm.get('material')?.value;
  
    const matType = materialValue ? materialValue.split('%')[0] : '';
    const matName = materialValue ? materialValue.split('%')[1] : '';

 
    let supplierCode = localStorage.getItem('code');

    if (!supplierCode) {
      supplierCode = '';
    }
   
    this.formData.append('GoodsName', this.productForm.value.productName);
    this.formData.append(
      'Specification',
      this.productForm.value.productDescription
    );
    this.formData.append('GroupCode', matType);
    this.formData.append('GroupName', matName);
    this.formData.append('Price', this.productForm.value.price);
    this.formData.append('SellerCode', supplierCode);
    this.formData.append('Quantity', this.productForm.value.quantity);
    this.formData.append('QuantityUnit', this.productForm.value.quantityUnit);
  }
  // onImageChange(event: any): void {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();

  //   reader.onload = (e) => {
  //     this.imagePreview = e.target?.result as string;
  //   };

  //   if (file) {
  //     this.imageFileName = file.name;
  //     // console.log('Image File Name:', this.imageFileName);
  //     reader.readAsDataURL(file);
  //   }
  // }
  onImageChange(event: any): void {
    const file = event.target.files[0];
    // const allowedTypes = [
    //   'image/jpeg',
    //   'image/jpg',
    //   'image/png',
    //   'image/svg+xml',
    //   'image/webp',
    // ];

    if (file) {
      // Validate file type
      // if (!allowedTypes.includes(file.type)) {
      //   console.log(
      //     'Invalid image type. Please select a valid image file (jpeg, jpg, png, svg, webp).'
      //   );
      //   return;
      // }

      // Validate file size
      if (file.size > this.MAX_FILE_SIZE_BYTES) {
        console.log('File size exceeds the maximum limit of 4MB.');
        this.imageSizeExceeded = true;
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };

      this.imageFileName = file.name;
      this.imageSizeExceeded = false;
      reader.readAsDataURL(file);
    }
  }
}
