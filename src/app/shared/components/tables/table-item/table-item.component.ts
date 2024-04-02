import {Component, Input} from '@angular/core';
import {Column} from "../../../interfaces/column";
import {DatePipe, DecimalPipe, NgIf, NgSwitch, NgSwitchCase} from "@angular/common";

@Component({
  selector: 'app-table-item',
  standalone: true,
  imports: [
    NgSwitch,
    NgIf,
    NgSwitchCase,
    DecimalPipe,
    DatePipe
  ],
  templateUrl: './table-item.component.html',
  styleUrl: './table-item.component.scss'
})
export class TableItemComponent {

  @Input() item: Column | undefined;
  @Input() value: any;

}
