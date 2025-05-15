import { Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-card',
  imports: [FormsModule,CommonModule],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css'
})
export class CategoryCardComponent {
  @Input() category: any;
  constructor(private router: Router) {}
  goToRelatedProducts() {
    this.router.navigate(['/category', this.category.name, 'related-products']);
  }
}
