import { Component } from '@angular/core';
import {MaterialModule} from "../../../../material-module";

@Component({
  selector: 'app-modal-delete',
  standalone: true,
  imports: [
    MaterialModule
  ],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.scss'
})
export class ModalDeleteComponent {

  deleteItem() {

  }
}
