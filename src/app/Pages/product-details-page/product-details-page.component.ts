import {
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CartDataService } from 'src/app/services/cart-data.service';
import { GoodsDataService } from 'src/app/services/goods-data.service';
import { ReviewRatingsService } from 'src/app/services/review-ratings.service';
import { CartItem } from '../cart-added-product/cart-item.interface';
declare var bootstrap: any;
@Component({
  selector: 'app-product-details-page',
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.css'],
})
export class ProductDetailsPageComponent {
  detailsData: any = [];
  totalRatings = 0;
  perRatingCount: any = [];
  buyerCode: any = '';
  avgRatings: any = 0;
  indexArray = [0, 1, 2, 3, 4];
  avgRatingsArray = [];
  fullStar: any = 0;
  decimalNumber: any = 0;
  fullStarArray: any = [];
  emptyStar: any = 0;
  emptyStarArray: any = [];
  isSeller = false;
  // Add cart related data
  cartDataDetail: Map<string, CartItem> = new Map<string, CartItem>();
  cartDataQt = new Map<string, number>();
  popUpCount: number = 0;
  totalPrice = 0;
  cartCount: number = 0;

  reviewData: any = [];         
  CartButtonText ="Add to Cart";
  enableTextarea = false; // Initial state is read-only
  @ViewChild('reviewBTN') reviewBTN!: ElementRef;
  @ViewChild('closeBTN') closeBTN!: ElementRef;
  reviewForm: FormGroup;
  isFormValid = false;
  rating = 0;
  formData = new FormData();
  errorMsg = false;
  reviewUpdateData: any;
  // Convert the object into an array of objects
  imageArray = Array.from({ length: Math.ceil(4) }, (_, index) => index + 1);

  @ViewChild('exampleModal') modalElement!: ElementRef;
  bsModal: any;

  // this.totalPages = Array.from(
  //   { length: Math.ceil(this.TotalRow / this.selectedValue) },
  //   (_, index) => index + 1
  // );

  constructor(
    private service: GoodsDataService,
    private elementRef: ElementRef,
    private reviewService: ReviewRatingsService,
    private cartDataService: CartDataService,

  ) {
    this.reviewForm = new FormGroup({
      rating: new FormControl(Validators.required),
      image: new FormControl(),
      reviwField: new FormControl(),
    });
    this.reviewForm.valueChanges.subscribe(() => {
      this.isFormValid = this.reviewForm.valid;
      // //console.log(this.isFormValid);
    });
  }

  ngOnInit() {
    const role = localStorage.getItem('role');
    if (role === 'seller') {
      this.isSeller = true;
    }
    // this.detailsData = this.goodsData.getDetaileData();
    // this.cartDataService.clearCartData();
    this.cartDataService.initializeAndLoadData();
    this.setServiceData();
    const productData = sessionStorage.getItem('productData');
    if (productData) {
      this.detailsData = JSON.parse(productData);
      console.log("this.detailsData ",this.detailsData)
    }
    if( this.detailsData.approveSalesQty == 0){
      this.CartButtonText ="Out of stock";
    }
    this.buyerCode = localStorage.getItem('code');
    //console.log(' buyerCode ', this.buyerCode);
   //console.log(" detailsData ",this.detailsData )
    // this.detailsData = this.goodsData.getDetaileData();

    //console.log('this.detailsData.goodsId,this.detailsData.groupCode', this.detailsData.goodsId,this.detailsData.groupCode);
    // //console.log('goodsName', this.detailsData.goodsName);
    console.log("this.detailsData.goodsId",this.detailsData.goodsId)
    this.service
      .getReviewRatingsData(
        this.detailsData.goodsId
      )
      .subscribe((data: any) => {
        console.log(' dAta ', data);
        this.reviewData = data.reviewsAndRatings;
        this.perRatingCount = data.ratingsArray;
        this.totalRatings = data.totalCount;
        //console.log(this.perRatingCount, this.totalRatings, 'count');
        const reviewsAndRatingsArray = JSON.parse(
          data.reviewsAndRatings[0].ratingArray
        );
        //console.log(' json convert', reviewsAndRatingsArray);
        //console.log(' review data dataaaaaa', this.reviewData); // Use a type if possible for better type checking

        this.ratingsColor();
      });

    this.reviewForm.get('rating')?.valueChanges.subscribe((rating) => {
      //console.log('Rating selected:', rating);
      this.errorMsg = false;
      this.rating = rating;
      // You can do something with the rating value here
    });
  }

 
  setDetail(detail: any) {
    this.reviewUpdateData = detail;
    //console.log(this.reviewUpdateData);
    this.reviewForm.patchValue({
      reviwField: this.reviewUpdateData ? this.reviewUpdateData.reviewText : '',
      rating: this.reviewUpdateData ? this.reviewUpdateData.ratingValue : '',
    });
  }

  editReview() {
    if (this.rating > 0) {
      this.formData.append('ReviewId', this.reviewUpdateData.reviewId);
      this.formData.append('RatingValue', this.reviewForm.value.rating);
      this.formData.append('ReviewText', this.reviewForm.value.reviwField);

      //console.log('FormData inside Add:');
      this.formData.forEach((value, key) => {
        //console.log(key, value);
      });
      this.reviewService.updateReviewAndRating(this.formData).subscribe({
        next: (response: any) => {
          //console.log(response);
          this.reviewForm.reset();
          this.closeBTN.nativeElement.click();
          window.location.reload();
        },
        error: (error: any) => {
          //console.log(error);
        },
      });
    } else {
      this.errorMsg = true;
    }
  }
  disableMouseActions = false;

  // Function to toggle the flag
  toggleMouseActions() {
    this.disableMouseActions = !this.disableMouseActions;
    //console.log('this.disableMouseActions', this.disableMouseActions);
  }
  mouse() {
    //console.log(' active');
  }
  ratingsColor() {
    // Get references to the div elements with type assertions
    const coloredDiv =
      this.elementRef.nativeElement.querySelectorAll('.colordiv');
    //console.log(' color DIV ', coloredDiv);
    const unColoredDiv =
      this.elementRef.nativeElement.querySelectorAll('.unColoredDiv');
    let avgRating = 0;
    // Check if the elements exist before setting their width
    for (let i = 0, j = 5; i < coloredDiv.length; i++, j--) {
      if (coloredDiv && unColoredDiv) {
        const width = this.perRatingCount[i] / this.totalRatings;
        avgRating += this.perRatingCount[i] * j;
        coloredDiv[i].style.width = `${width * 15}rem`; // Set the width to 50%
        unColoredDiv[i].style.width = `${15 - width * 15}rem`; // Set the width to 75%
      }
    }

    // calculating  avg rating point
    this.avgRatings = (avgRating / this.totalRatings).toFixed(1);
    const decimalPart = this.avgRatings.toString().split('.')[1];
    this.decimalNumber = parseInt(decimalPart);

    this.fullStar = Math.floor(avgRating / this.totalRatings);
    this.fullStarArray = Array.from(
      { length: this.fullStar },
      (_, index) => index + 1
    );
    //console.log(' arrayyy', this.fullStarArray);

    // let fullstarCellvalue = parseFloat((avgRating / this.totalRatings).toFixed(0));
    let fullstarCellvalue = Math.ceil(avgRating / this.totalRatings);

    // finding empty star
    this.emptyStar = 5 - fullstarCellvalue;
    //console.log(' empty star', this.emptyStar, fullstarCellvalue);
    // Creating  empty star Array
    this.emptyStarArray = Array.from(
      { length: this.emptyStar },
      (_, index) => index + 1
    );
    //console.log(' emptyStarArray', this.emptyStarArray);
  }

  parseRatingArray(ratingArrayString: string): number[] {
    return JSON.parse(ratingArrayString);
    // return ([1, 2, 3, 4, 5]);
  }

  parseRatingEmptyArray(ratingEmptyArrayString: string): number[] {
    return JSON.parse(ratingEmptyArrayString);
    // return ([1, 2, 3, 4, 5]);
  }
  toggleTextareaEdit() {
    this.enableTextarea = !this.enableTextarea;
  }
  isFieldInvalid(x: any) {}

  // creating full star array
  ratingArray(i: number): number[] {
    let n = 5 - i;
    return Array.from({ length: n }, (_, index) => index + 1);
  }

  // creating empty star array
  EmptyratingArray(i: number): number[] {
    let n = i;
    return Array.from({ length: n }, (_, index) => index + 1);
  }

  avgRatingStar(): string {
    let count = 0;
    const divElement = document.createElement('div');

    divElement.className = 'my-div';
    //  run a loop to display full star
    for (let i = 0; i < this.fullStar; i++) {
      count++;
      const starIcon = document.createElement('img');
      starIcon.src = '../../../assets/images/star/fullStar.png';
      starIcon.className = 'avgRatingStarr';
      starIcon.style.width = '1rem';
      divElement.appendChild(starIcon);
    }
    //   checking is there need any semi colored star
    if (this.decimalNumber != 0) {
      count++;
      const starIcon = document.createElement('img');
      starIcon.className = 'avgRatingStarr';
      if (this.decimalNumber > 0) {
        starIcon.src = '../../../assets/images/star/4.3Star.png';
      }
      if (this.decimalNumber > 3) {
        starIcon.src = '../../../assets/images/star/4.4Star.png';
      }
      if (this.decimalNumber > 4) {
        starIcon.src = '../../../assets/images/star/4.5Star.png';
      }
      if (this.decimalNumber > 6) {
        starIcon.src = '../../../assets/images/star/4.7Star.png';
      }

      divElement.appendChild(starIcon);
    }
    //  run a loop to display empty star
    for (let i = 0; i < this.emptyStar; i++) {
      const starIcon = document.createElement('img');
      starIcon.src = '../../../assets/images/star/emptyStar.png';
      starIcon.className = 'avgRatingStarr';
      divElement.appendChild(starIcon);
    }

    return divElement.outerHTML;
  }

  setServiceData() {
    this.cartCount = this.cartDataService.getCartCount();
    this.cartDataDetail = this.cartDataService.getCartData().cartDataDetail;
    this.cartDataQt = this.cartDataService.getCartData().cartDataQt;
    this.totalPrice = this.cartDataService.getTotalPrice();
  }
  setCart(entry: any, inputQt: string) {
    //console.log(entry.approveSalesQty, 'approveSalesQty');

    if (entry.price === '' || entry.price === undefined) {
      entry.price = '0';
    }
    let groupCodeIdSellerId = entry.groupCode + '&' + entry.goodsId + '&' + entry.sellerCode;

    this.cartDataService.setCartCount(groupCodeIdSellerId);
    this.cartDataService.setPrice(
      entry.netPrice,
      parseInt(inputQt),
      groupCodeIdSellerId
    );
    this.cartDataService.setCartData(entry, inputQt);
    this.setServiceData();
    this.popUpCount = parseInt(inputQt);
  }
  // After Open modal 2 second later it automatically close
  ngAfterViewInit() {
    this.bsModal = new bootstrap.Modal(this.modalElement.nativeElement);
    this.modalElement.nativeElement.addEventListener('shown.bs.modal', () => {
      setTimeout(() => {
        this.bsModal.hide();
      }, 2000);
    });

    const carousel = document.querySelector('.carousel');
    if (carousel) {
      new bootstrap.Carousel(carousel);
    }
  } 

  getMaxValue(val: any) {
    return parseInt(val);
  }

  onInputChange(event: any, entry: any) {
    const inputValue = parseFloat(event.target.value);
    const maxValue = parseFloat(entry.approveSalesQty);

    if (inputValue > maxValue) {
      event.target.value = maxValue.toString();
    } else {
      event.target.value = inputValue;
    }
  }

  isEmpty(event: any) {
    if (event.target.value == '') {
      event.target.value = 1;
      this.cartCount = 1;
    }
  }
  deleteFromSideCart(entry: any) {
    this.cartDataService.deleteCartData(entry.key);
    this.setServiceData();
  }
}
