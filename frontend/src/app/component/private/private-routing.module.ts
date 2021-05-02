import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivateComponent } from './private.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderFormComponent } from './order/order-form/order-form.component';
import { AuthGuardMiddleware } from '../../middleware/auth-guard.middleware';

const routes: Routes = [
  {
    path: '',
    component: PrivateComponent,
    canActivate: [
      AuthGuardMiddleware,
    ],
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'order/create',
        component: OrderFormComponent
      },
      {
        path: '',
        redirectTo: '/private/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/private/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrivateRoutingModule { }
