import {Routes} from '@angular/router';

import {FullComponent} from './layouts/full/full.component';
import {checkAuthGuard} from "./shared/guards/check-auth.guard";
import {checkLoginGuard} from "./shared/guards/check-login.guard";

export const AppRoutes: Routes = [
  {
    path: 'login',
    canActivate:[checkLoginGuard],
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '',
    canActivate:[checkAuthGuard],
    component: FullComponent,
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
    /*children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren:
          () => import('./material-component/material.module').then(m => m.MaterialComponentsModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },

    ]*/
  },

  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];
