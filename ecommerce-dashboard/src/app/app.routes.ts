import { Routes } from '@angular/router';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { ProductListComponent } from './product-list/product-list.component';

export const routes: Routes = [
  {path:'',redirectTo:'home',pathMatch:'full'},
  { path:'home',loadComponent:()=>import('./features/components/home/home.component').then(m=>m.HomeComponent)},
  {path:'about',loadComponent:()=>import('./shared/components/about/about.component').then(m=>m.AboutComponent)},
  {path:'categoryPage',loadComponent:()=>import('./features/components/category-page/category-page.component').then(m=>m.CategoryPageComponent)},
  {path:'productPage',loadComponent:()=>import('./features/components/product-page/product-page.component').then(m=>m.ProductPageComponent)},
  {path: 'dashboard',component: DashboardComponent,
    children: [
      { path: 'categories', component: CategoryFormComponent },
      { path: 'products', component: ProductFormComponent },
      {path:'showCategories',component:CategoryListComponent},
      {path:'showProducts',component:ProductListComponent},
      { path: '', redirectTo: 'categories', pathMatch: 'full' }
    ]},
];
