import { Component } from '@angular/core';
import { BannerComponent } from "../banner/banner.component";
import { StoreComponent } from "../JewelleryStore/store/store.component";
import { CategoryComponent } from "../category/category.component";
import { ExploreComponent } from "../JewelleryStore/explore/explore.component";
import { ProductComponent } from "../product/product.component";
import { ServicesComponent } from "../services/services.component";

@Component({
  selector: 'app-home',
  imports: [BannerComponent, StoreComponent, CategoryComponent, ExploreComponent, ProductComponent, ServicesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
