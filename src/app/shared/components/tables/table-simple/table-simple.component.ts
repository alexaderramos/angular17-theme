import {Component, Input} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-table-simple',
  standalone: true,
  imports: [],
  templateUrl: './table-simple.component.html',
  styleUrl: './table-simple.component.scss'
})
export class TableSimpleComponent {
  time_download: number = 0.080
  filterSearch: string = '';
  filterBy: number = -1;
  filterByModel: any = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  minRegTable: number = 10;
  objectSelect: any;
  loadingData: boolean = false
  spinDownload: boolean = false;
  checkboxAll: boolean = false;
  checkboxUnd: boolean = false;
  listDataFilter: any[] = [];
  campaignOne: FormGroup|undefined;
  @Input() columns: Column[] = [];
  @Input() listData: any[] = [];
  @Input() options: OptionTable[] = [];
  @Input() newUrl: string;
  @Input() getDataUrl: string;
  @Input() newUrlMessage: string = '';
  @Input() updateUrl: string;
  @Input() deleteUrl: string;
  @Input() downloadUrl: string;
  @Input() nameModel: string = '';
  @Input() moduleName: string = '';
  @Input() submoduleName: string = '';
  @Input() classHeight: string = '';
  @Input() viewingPaginate: string = 'registros';
  @Input() bulkUploadUrl: string = '';
  @Input() gridUploadUrl: string = '';
  @Input() show_filter: boolean = true;
  @Input() show_filter_date: boolean = false;
  @Input() show_filter_inputs: boolean = true;
  @Input() actionFixed: boolean = false;

  @Output() onLoadData = new EventEmitter<string>();

  @Input() requiredPermissions: boolean = true;

  @ViewChild('modal_view') modal_view: TemplateRef<any>;
  @ViewChild('delete_item') delete_item: TemplateRef<any>;
  @ViewChild('modal_loading') modal_loading: TemplateRef<any>;
  @ViewChild('modal_information') modal_information: TemplateRef<any>;
  message_loading: string = '';
  message_information: string = '';

  tableStyles: any = defaultTableStyles
}
