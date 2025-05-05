import { Routes } from '@angular/router';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ShowUsersComponent } from './users/show-users/show-users.component';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: 'categories', component: CategoryFormComponent },
      { path: 'products', component: ProductFormComponent },
      {path:'showCategories',component:CategoryListComponent},
      { path: 'showProducts', component: ProductListComponent },
      {path:'showUsers',component:ShowUsersComponent,title:"Users"},
      { path: '', redirectTo: 'categories', pathMatch: 'full' }
    ]
  }
];
