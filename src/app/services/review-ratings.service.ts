import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../config';

@Injectable({
  providedIn: 'root',
})
export class ReviewRatingsService {
  URL = API_URL;
  addReviewAndRatingURL = `${this.URL}/api/ReviewAndRating/addReviewAndRating`;
  updateReviewAndRatingURL = `${this.URL}/api/ReviewAndRating/UpdateReviewAndRatings`;
  addReviewUrl = `${this.URL}/api/ReviewAndRating/getReviewRatingsData`;
  getReviewUrl = `${this.URL}/api/ReviewAndRating/getReviewRatings`;

  constructor(private http: HttpClient) {}
  addReviewAndRating(review: any) {
    return this.http.post(this.addReviewAndRatingURL, review);
  }
  updateReviewAndRating(reviewAndRating: any) {
    // const reviewAndRating = {
    //   reviewId: reviewId,
    //   RatingValue: rating,
    //   ReviewText: review,
    // };
    //console.log(reviewAndRating, 'rev');
    return this.http.put(this.updateReviewAndRatingURL, reviewAndRating);
  }

  // newly added for adding review and ratings...
  addReview(review: any) {
    return this.http.post(this.addReviewUrl, review);
  }

  // newly added  get review
  getReview(review: any) {
    return this.http.get(this.getReviewUrl, review);
  }
}
