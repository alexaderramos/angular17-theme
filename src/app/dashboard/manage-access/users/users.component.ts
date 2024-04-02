import { Component } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {TableSimpleComponent} from "../../../shared/components/tables/table-simple/table-simple.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatCardModule,
    TableSimpleComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

}
