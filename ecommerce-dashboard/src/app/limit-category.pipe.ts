import { Pipe, PipeTransform } from '@angular/core';
import { Category } from './category'; // adjust path if needed

@Pipe({
  name: 'limitCategory',
  standalone: true
})
export class LimitCategoryPipe implements PipeTransform {
  transform(categories: Category[], limit: number): Category[] {
    if (!Array.isArray(categories)) return [];
    return categories.slice(0, limit);
  }
}
