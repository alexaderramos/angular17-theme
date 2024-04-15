import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {CommissionsComponent} from "./commissions/commissions.component";

const routes: Routes = [
  {
    path:'commissions',
    component: CommissionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
