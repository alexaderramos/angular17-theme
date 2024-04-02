import {Component} from '@angular/core';
import {MaterialModule} from "../../../material-module";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forbidden-page',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './forbidden-page.component.html',
  styleUrl: './forbidden-page.component.scss'
})
export class ForbiddenPageComponent {

  constructor(
    private router: Router,
    private _location: Location
  ) {
  }

  toBack() {

  }
}
