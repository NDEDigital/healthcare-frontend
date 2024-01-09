import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoodsDataService } from 'src/app/services/goods-data.service';

@Component({
  selector: 'app-product-sidebar',
  templateUrl: './product-sidebar.component.html',
  styleUrls: ['./product-sidebar.component.css']
})
export class ProductSidebarComponent implements OnInit {
    
  goods:any;
  groupData = new Map();
  showAll = false; // Variable to toggle the view state
  initialLimit = 5; // Number of items to show initially
  constructor(
    private goodsData: GoodsDataService,
  ) {}
  ngOnInit(): void {
    this.goodsData.getNavData().subscribe((data: any[]) => {
      console.log(data,"dsdsd");
      
     this.goods = data;
     for (let i = 0; i < this.goods.length; i++) {
      this.groupData.set(this.goods[i].productGroupCode, this.goods[i].productGroupName);
    }
  }
)};

    
}
