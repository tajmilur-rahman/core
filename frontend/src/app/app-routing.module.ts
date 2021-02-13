import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'public',
    loadChildren: () => import('./component/public/public.module').then(m => m.PublicModule)
  },
  {
    path: 'private',
    loadChildren: () => import('./component/private/private.module').then(m => m.PrivateModule)
  },
  {
    path: '',
    redirectTo: '/public/login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
