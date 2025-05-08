import { Routes } from '@angular/router';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ShowUsersComponent } from './users/show-users/show-users.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import path from 'path';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/components/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: 'payment-success',
    component: PaymentSuccessComponent,
    title: 'Payment Success'
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./shared/components/about/about.component').then(
        (m) => m.AboutComponent
      ),
  },
  {
    path: 'categoryPage',
    loadComponent: () =>
      import(
        './features/components/category-page/category-page.component'
      ).then((m) => m.CategoryPageComponent),
  },
  {
    path: 'productPage',
    loadComponent: () =>
      import('./features/components/product-page/product-page.component').then(
        (m) => m.ProductPageComponent
      ),
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./features/components/product-details/product-details.component')
      .then((m) => m.ProductDetailsComponent)
  },
  {
    path:'category/:name/related-products',
    loadComponent: () => import('./features/components/related-products/related-products.component')
      .then((m) => m.RelatedProductsComponent)
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'categories', component: CategoryFormComponent },
      { path: 'products', component: ProductFormComponent },
      { path: 'showCategories', component: CategoryListComponent },
      { path: 'showProducts', component: ProductListComponent },
      { path: 'showUsers', component: ShowUsersComponent, title: 'Users' },
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
      {
        path: "cart",
        component: CartComponent,
        title: "Cart"
      }
    ],
  },
  { path: 'login', component: LoginComponent, title: 'Login' },
  {
    path: 'register', component: RegisterComponent, title: 'Register' },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
    title: 'forgetPassword',
  },
];
