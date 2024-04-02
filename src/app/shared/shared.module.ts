import { NgModule } from '@angular/core';

import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
import {NgSelectModule} from "@ng-select/ng-select";
import {MaterialModule} from "../material-module";


@NgModule({
  declarations: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective
  ],
  exports: [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective
   ],
  imports:[
    NgSelectModule,
    MaterialModule
  ],
  providers: [ MenuItems ]
})
export class SharedModule { }
