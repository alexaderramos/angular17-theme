import { Component } from '@angular/core';
import {SharedModule} from "../../../shared/shared.module";

@Component({
  selector: 'app-commissions',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './commissions.component.html',
  styleUrl: './commissions.component.scss'
})
export class CommissionsComponent {

}
