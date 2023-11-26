import { Component } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
})
export class ErrorComponent {
  page = 1;
  pageSize = 10; // Number of items per page
  totalPages = 12; // Total number of pages (calculate based on the collection size and page size)

  // Method to navigate to a specific page
  navigateToPage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      // ... Implement your logic to fetch the data for the new page
      console.log("a gaya");
      
    }
  }

  // Method to get the range of pages to display in the pagination
  getDisplayPageRange(): number[] {
     console.log('a gaya2');
    const displayRangeSize = 5; // Number of pages to display at a time
    const middlePage = Math.ceil(displayRangeSize / 2);
    let startPage = this.page - middlePage + 1;
    if (startPage <= 0) {
      startPage = 1;
    }
    const endPage = Math.min(startPage + displayRangeSize - 1, this.totalPages);
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  }
}
