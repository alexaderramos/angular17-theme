import {Routes} from '@angular/router';

import {DashboardComponent} from './dashboard.component';

export const DashboardRoutes: Routes = [{
  path: '',
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent
    },
    {
      path: 'manage-access',
      loadChildren: () =>
        import('./manage-access/manage-access.module')
        .then(m => m.ManageAccessModule)
    },
    // {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
  ]
}];
