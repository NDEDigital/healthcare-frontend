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
  ) {
    this.productForm = new FormGroup({
      productName: new FormControl(''),
      productDescription: new FormControl(''),
      image: new FormControl(''),
      material: new FormControl(''),
      height: new FormControl(''),
      width: new FormControl(''),
      length: new FormControl(''),
      dimensionUnit: new FormControl('mm'),
      weight: new FormControl(''),
      weightUnit: new FormControl('Kg'),
      price: new FormControl(''),
      finish: new FormControl(''),
      quantity: new FormControl(''),
      quantityUnit: new FormControl('Ton'),
      grade: new FormControl(''),
    });
    this.productForm.valueChanges.subscribe(() => {
      this.isFormValid = this.productForm.valid;
    });

    fetch('https://api.ipify.org?format=json')               
      .then((response) => response.json())
      .then((data) => {
        this.publicIP = data.ip;
        // console.log(this.publicIP, 'public ip');
      });

    const productData = sessionStorage.getItem('editData');
    if (productData) {
      this.product = JSON.parse(productData);
      /// console.log(this.product, productData);
      if (this.product != undefined) this.editMode = true;
    }

    //sharedService.editProduct;
  }
  ngOnInit() {
    console.log(this.editMode);
    this.loadData();
    if (this.editMode) {
      this.headerTitle = 'Update Product';
      this.submitBtnTitle = 'Update';
      this.setValues();
      this.productForm.get('material')?.disable();
      this.selectedMaterial = this.product.materialType;
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
    console.log(this.product.materialName);
    const materialValue =
      this.product.materialType + '%' + this.product.materialName;
    console.log(materialValue, 'materialValue');

    this.productForm.patchValue({
      productName: this.product.productName,
      productDescription: this.product.productDescription,
      material: this.product.materialType + '%' + this.product.materialName,
      height: this.product.height,
      width: this.product.width,
      length: this.product.length,
      dimensionUnit: this.product.dimensionUnit,
      weight: this.product.weight,
      weightUnit: this.product.weightUnit,
      price: this.product.price,
      finish: this.product.finish,
      quantity: this.product.quantity,
      quantityUnit: this.product.quantityUnit,
      grade: this.product.grade,
    });
    this.productForm.get('image')?.disable();
  }
  updateProduct() {
    console.log('update callde');

    this.addFormData();
    this.formData.append('Status', 'edited');
    this.formData.append('StatusBit', '4');
    this.formData.append('UpdatedPC', this.publicIP);
    this.formData.append('ProductId', this.product.productId);
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
    this.formData.append('StatusBit', '1');
    this.formData.append('Image', this.imageInput.nativeElement.files[0]);
    this.formData.append('ImageName', this.imageFileName || '');
    this.formData.append('AddedPC', this.publicIP);
    this.formData.append('UpdatedPC', this.publicIP);
    console.log('FormData inside Add:');
    this.formData.forEach((value, key) => {
      console.log(key, value);
    });
    // if (this.isFormValid) {
    this.dashboardData.addProduct(this.formData).subscribe({
      next: (response) => {
        console.log('Product Added successfully', response);
        this.productForm.reset();
        this.imagePreview = '';
        this.productForm
          ?.get('material')
          ?.setValue([...this.products.values()][0]);
        this.productForm?.get('dimensionUnit')?.setValue(['mm']);
        this.productForm?.get('weightUnit')?.setValue(['Kg']);
        this.productForm?.get('quantityUnit')?.setValue(['Ton']);
        window.location.href = '/dashboard';
      },
      error: (error) => {
        console.error('Error', error);
      },
    });
    // }
  }

  addFormData() {
    const materialValue = this.productForm.get('material')?.value;
    // console.log(materialValue);
    // const materialValue = this.productForm.value.material;
    const matType = materialValue ? materialValue.split('%')[0] : '';
    const matName = materialValue ? materialValue.split('%')[1] : '';

    // console.log(
    //   materialValue,
    //   'materialValue',
    //   matType,
    //   'matType',
    //   matName,
    //   'matName'
    // );

    let supplierCode = localStorage.getItem('code');
    if (!supplierCode) {
      supplierCode = '';
    }
    this.formData.append('ProductName', this.productForm.value.productName);
    this.formData.append(
      'ProductDescription',
      this.productForm.value.productDescription
    );
    this.formData.append('MaterialType', matType);
    this.formData.append('MaterialName', matName);
    this.formData.append('Height', this.productForm.value.height);
    this.formData.append('Width', this.productForm.value.width);
    this.formData.append('Length', this.productForm.value.length);
    this.formData.append('DimensionUnit', this.productForm.value.dimensionUnit);
    this.formData.append('Weight', this.productForm.value.weight);
    this.formData.append('WeightUnit', this.productForm.value.weightUnit);
    this.formData.append('Finish', this.productForm.value.finish);
    this.formData.append('Grade', this.productForm.value.grade);
    this.formData.append('Price', this.productForm.value.price);
    this.formData.append('SupplierCode', supplierCode);
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
