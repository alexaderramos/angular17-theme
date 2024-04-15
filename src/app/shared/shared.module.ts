import {NgModule} from '@angular/core';

import {MenuItems} from './menu-items/menu-items';
import {AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective} from './accordion';
import {NgSelectModule} from "@ng-select/ng-select";
import {MaterialModule} from "../material-module";
import {TableSimpleComponent} from "./components/tables/table-simple/table-simple.component";
import {TableItemComponent} from "./components/tables/table-item/table-item.component";
import {NgClass, NgForOf, NgIf, NgStyle, NgSwitchCase, NgTemplateOutlet} from "@angular/common";
import {TableMaterialComponent} from "./components/tables/table-material/table-material.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MAT_DATE_LOCALE} from "@angular/material/core";


@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    TableMaterialComponent,
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    TableMaterialComponent
  ],
  imports: [
    NgSelectModule,
    MaterialModule,
    NgSwitchCase,
    NgForOf,
    FormsModule,
    NgIf,
    TableItemComponent,
    NgClass,
    ReactiveFormsModule,
    NgStyle,
    NgTemplateOutlet
  ],
  providers: [
    MenuItems,
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
  ]
})
export class SharedModule {
}
