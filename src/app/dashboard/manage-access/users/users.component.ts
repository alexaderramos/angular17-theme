import {Component, OnInit} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {TableSimpleComponent} from "../../../shared/components/tables/table-simple/table-simple.component";
import {SharedModule} from "../../../shared/shared.module";
import {ApiService} from "../../../shared/services/api.service";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatCardModule,
    TableSimpleComponent,
    SharedModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {


  columns:any [] = [];
  data:any [] = [];

  constructor(
    private api: ApiService,
  ) {
  }

  ngOnInit() {

  }


}
