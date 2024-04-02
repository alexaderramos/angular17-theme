import { NgModule } from '@angular/core';

import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
import {NgSelectModule} from "@ng-select/ng-select";
import {MaterialModule} from "../material-module";
import {TableSimpleComponent} from "./components/tables/table-simple/table-simple.component";
import {TableItemComponent} from "./components/tables/table-item/table-item.component";
import {NgSwitchCase} from "@angular/common";


@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective
   ],
  imports: [
    NgSelectModule,
    MaterialModule,
    NgSwitchCase
  ],
  providers: [ MenuItems ]
})
export class SharedModule { }
