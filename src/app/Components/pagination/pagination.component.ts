import {
  Component,
  Input,
  EventEmitter,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
// export class PaginationComponent implements OnChanges {
export class PaginationComponent {
  selectedIconIndex: string = '';
  selectedPageIndex: number = 1;

  searchValue: string = '';
  selectedValue: number = 10; //data par page initially
  dataArray: number[] = [];
  @Input() inputdata: number[] = []; //length of data]
  // @Input() inputdata: number =0; //length of data]

  // @Output() myData = new EventEmitter<number>();
  @Output() myData = new EventEmitter<{
    selectedPageIndex: number;
    selectedValue: number;
  }>();
  ngOnInit() {

    this.pagination();
  }
  ngOnChanges() {}
  reloadData() {

    this.selectedIconIndex = '';
    this.selectedPageIndex = 1;
    this.selectedValue = 10;
    this.pagination();
  }
  pagination() {
    const dataToEmit = {
      selectedPageIndex: this.selectedPageIndex,
      selectedValue: this.selectedValue,
    };
    this.myData.emit(dataToEmit);
  }

  showValue() {
    this.pagination();
  }

  go_Prev_Next_Page(destination: string) {
    if (destination == 'next') {
      if (this.selectedPageIndex < this.inputdata.length) {
        this.selectedIconIndex = destination;
        this.selectedPageIndex++;
        this.pagination();
      } else {
        this.selectedIconIndex = '';
      }
    } else {
      if (this.selectedPageIndex > 1) {
        this.selectedIconIndex = destination;
        this.selectedPageIndex--;
        this.pagination();
      } else {
        this.selectedIconIndex = '';
      }
    }
  }

  updateIndices(iconIndex: string) {
    if (iconIndex == 'start') {
      if (this.selectedPageIndex != 1) {
        this.selectedPageIndex = 1;
        this.selectedIconIndex = iconIndex;
        this.pagination();
      } else {
        this.selectedIconIndex = '';
      }
    } else {
      if (this.selectedPageIndex != this.inputdata.length) {
        this.selectedPageIndex = this.inputdata.length;
        this.selectedIconIndex = iconIndex;
        this.pagination();
      } else {
        this.selectedIconIndex = '';
      }
    }
  }

  changePageNumber(PageNumber: number) {

    this.selectedIconIndex = '';
    this.selectedPageIndex = PageNumber;
    this.pagination();
  }
}
