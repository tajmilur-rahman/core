import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PrivateComponent } from './private.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrderFormComponent } from './order/order-form/order-form.component';
import { OrderViewComponent } from './order/order-view/order-view.component';
import { OrderListComponent } from './order/order-list/order-list.component';
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
        path: 'order/form/:id',
        component: OrderFormComponent
      },
      {
        path: 'order/form',
        component: OrderFormComponent
      },
      {
        path: 'order/:id',
        component: OrderViewComponent
      },
      {
        path: 'order',
        component: OrderListComponent
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
