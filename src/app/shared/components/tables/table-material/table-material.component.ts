import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {NgForOf} from "@angular/common";
import {Moment} from 'moment';
import * as moment from 'moment-timezone';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ApiService} from "../../../services/api.service";
import {SelectionModel} from "@angular/cdk/collections";
import {debounceTime, Subject, Subscription} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {Column} from "../../../interfaces/column";
import {TableStylesConstant} from "../../../constants/table-styles.constant";
import {FormControl, FormGroup} from "@angular/forms";
import {PermissionService} from "../../../services/permission.service";
import {AlertService} from "../../../services/alert.service";
import {LoadingBarService} from "@ngx-loading-bar/core";
import {Params, Router} from "@angular/router";
import 'moment/locale/es.js'
import {OptionTable} from "../../../interfaces/option-table";

@Component({
  selector: 'app-table-material',
  templateUrl: './table-material.component.html',
  styleUrl: './table-material.component.scss'
})
export class TableMaterialComponent implements OnInit, AfterViewInit {


  @Input() title: string = '';
  @Input() description: string = '';
  @Input() showFilterByDateRange: boolean = true;
  @Input() showActionColumn: boolean = true;

  @Input() getAPI: string = '';
  @Input() deleteAPI: string = '';
  @Input() downloadAPI: string = '';
  @Input() createROUTE: string = '';
  @Input() updateROUTE: string = '';
  @Input() bulkUploadROUTE: string = '';
  @Input() gridUploadROUTE: string = '';

  @Input() module: string = '';
  @Input() subModule: string = '';

  @Input() requiredPermissions: boolean = false

  @Input() idEditable: string = '';
  @Input() editOnModal: boolean = false;

  @Output() onLoadData = new EventEmitter<any>();
  @Output() messageEvent = new EventEmitter<string>();

  @Input() options: OptionTable[] = [];

  // -- check
  time_download: number = 0.080
  @ViewChild('modalView') modalView: TemplateRef<any> | undefined;
  @ViewChild('modalLoading') modalLoading: TemplateRef<any> | undefined;
  @ViewChild('modalDelete') modalDelete: TemplateRef<any> | undefined;


  tableStyles: any = TableStylesConstant;
  data: any[] = [];
  columns: Column[] = [];
  searchByColumn: Column | undefined;
  dataSource: MatTableDataSource<any> = new MatTableDataSource;
  displayedColumns: string[] = [];
  selection = new SelectionModel<any>(true, []);

  @ViewChild(MatSort) sort: MatSort = new MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  private searchSubject: Subject<void> = new Subject();
  private searchSubscription: Subscription | undefined;
  search: string = '';
  searchDate: string = '';

  campaignOne: FormGroup = new FormGroup({
    start: new FormControl(null),
    end: new FormControl(null),
  });


  spinDownload: boolean = false;
  searchByText: string = '';
  rangeDate: { start: string; end: string } = {start: '', end: ''};
  messageLoading: string = '';
  objectSelect: any;
  loadingData: boolean = false;


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private router: Router,
    private sPermission: PermissionService,
    private sAlert: AlertService,
    private loading: LoadingBarService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {

    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();


    this.campaignOne = new FormGroup({
      start: this.showFilterByDateRange
        ? new FormControl(new Date(year, month, 1))
        : new FormControl(null),
      end: this.showFilterByDateRange
        ? new FormControl(new Date(year, month, today.getDate()))
        : new FormControl(null),
    });
  }

  async ngOnInit() {
    this.sPermission.generatePermissionNames(this.module, this.subModule)


    this.searchSubscription = this.searchSubject
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.filterData();
      })


    /*this.campaignOne = new FormGroup({
      start: this.showFilterByDate
        ? new FormControl(new Date(year, month, 1))
        : new FormControl(null),
      end: this.showFilterByDate
        ? new FormControl(new Date(year, month, today.getDate()))
        : new FormControl(null),
    });*/

    if (this.showFilterByDateRange) {
      this.changeDateRange()
    } else {
      await this.getData()

    }
  }


  async getData() {

    if (!this.sPermission.canView() && this.requiredPermissions) return;

    if (this.loadingData) {
      this.sAlert.warning('Waiting a moment');
      return;
    }

    this.loading.start();
    this.loadingData = true;

    let queryParams: Params = {};

    if (this.showFilterByDateRange) {
      queryParams = {
        start_date: this.rangeDate.start,
        end_date: this.rangeDate.end
      }
    }

    this.api.get(this.getAPI, queryParams)
      .then(response => {
        if (response.status) {
          this.columns = response.data.columns;
          this.data = response.data.data;
          this.onLoadData.emit(response.data)

          this.updateDisplayedColumns()

          if (this.columns.length > 0) {
            this.searchByColumn = this.columns[0]
            this.searchByText = 'por: ' + this.searchByColumn.name
          }

          this.dataSource = new MatTableDataSource(this.data);
          this.dataSource.sort = this.sort;

          this.dataSource.sortingDataAccessor = (item, property) => {
            switch (property) {
              case 'date': {
                if (item.date) {
                  return new Date(item.date).getTime();
                }
                return item[property]
              }
              default:
                return item[property]
            }
          }

          this.dataSource.filterPredicate = (data: any, filter: string) => {

            if (this.searchByColumn) {
              const rowValue = data[this.searchByColumn.id];
              switch (this.searchByColumn.type) {
                case 'datetime':
                  let dateSearch2 = moment(filter).format('YYYY-MM-DD')
                  let rowFormat = moment(rowValue).format('YYYY-MM-DD')
                  return dateSearch2 == rowFormat
                case 'date':
                  const dateSearch = moment(filter).format('YYYY-MM-DD')
                  return dateSearch == rowValue
                case 'decimal': {
                  return rowValue == filter
                }
                case 'number': {
                  return rowValue == filter
                }
                default: {
                  return this.normalizeCase(data[this.searchByColumn.id]).includes(this.normalizeCase(filter))
                }
              }
            }
            return true;

          }


          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }

        }
      })
      .finally(() => {
        this.loading.complete();
        this.loadingData = false;
      })
  }


  setDataSourceAttributes() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    this.dataSource.sort = this.sort;

    if (this.paginator && this.sort) {
      // this.applyFilter('');
    }
  }


  ngAfterViewInit() {
    /* if (this.paginator) {
       this.dataSource.paginator = this.paginator;
     }*/
    this.setDataSourceAttributes()
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  filterData() {
    console.log(this.searchDate)
    this.dataSource.filter = (this.searchByColumn?.type == 'date' || this.searchByColumn?.type == 'datetime') ? this.searchDate : this.search;
  }

  changeInput(event: any) {
    this.searchSubject.next();
  }

  openDialog() {
    if (this.modalView) {
      this.dialog.open(this.modalView);
    }
  }

  updateDisplayedColumns() {
    this.displayedColumns = ['select', ...this.columns.filter(column => column.display).map(column => column.id)];

    if (this.showActionColumn) {
      this.displayedColumns.push('action')
    }
  }

  selectSearchBy(column: Column) {
    this.searchByColumn = column
    this.search = ''
    this.searchDate = ''
    this.searchByText = 'por: ' + column.name
  }

  normalizeCase(stringValue: string) {
    if (!stringValue) return '';

    return stringValue.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  async changeDateRange() {
    this.rangeDate = this.getRangeDate();
    if (this.rangeDate.start != '' && this.rangeDate.end != '') {
      await this.getData();
    }
  }

  getRangeDate() {
    let startDate = this.getDateQueryString(this.campaignOne.value.start);
    let endDate = this.getDateQueryString(this.campaignOne.value.end);
    return {
      start: startDate,
      end: endDate,
    };
  }

  getDateQueryString(str: any) {
    if (str == undefined || str == '') {
      return '';
    }
    let dateObjet = new Date(str);
    dateObjet.setMinutes(
      dateObjet.getMinutes() - dateObjet.getTimezoneOffset()
    );
    return dateObjet.toJSON().slice(0, 10);
  }


  ///--------------------- Actions


  async download() {

    if (!this.sPermission.canDownload(this.requiredPermissions) && this.requiredPermissions) return;

    if (!this.selection.selected.length) {
      return this.sAlert.error('You selected 0 items. Try harder');
    }

    if (this.spinDownload) return this.sAlert.warning('Is already downloading');

    this.spinDownload = true;
    if (this.modalLoading) {
      this.dialog.open(this.modalLoading, {disableClose: true});
    }

    this.messageLoading = 'Wait a moment.';
    try {
      let listFilter = this.selection.selected
      console.log(listFilter);

      let new_array = listFilter.map((item) => {
        let new_element: any = {};

        this.columns.forEach((column) => {
          if (column.display) {
            if (column.second_id === '') {
              if (item[column.id]) {
                new_element[column.name] = item[column.id];
              } else {
                new_element[column.name] = '--';
              }
            } else if (item[column.id]) {
              new_element[column.name] = item[column.id][column.second_id];
            } else {
              new_element[column.name] = '--';
            }
          }
        });

        return new_element;
      });

      let time = this.getTimeDownload(new_array.length)
      //this.messageLoading += ' Estimated time: ' time + 'minutes';

      let date = new Date();
      let name = `REPORT ${this.subModule.toUpperCase()} ${date.getDate()}${
        date.getMonth() + 1
      }${date.getFullYear()}.xlsx`;

      let column_select: any[] = this.columns.reduce((array: any [], ele) => {
        if (ele.display) {
          array.push(ele);
        }
        return array;
      }, []);

      await this.api
        .download(this.downloadAPI, name, {
          columns: column_select,
          data: new_array,
        })
        .finally(() => (this.spinDownload = false));
    } catch (error) {
      this.sAlert.error('An error occurred while processing the records. Please try again in a few minutes');
      console.log(error);
    } finally {
      this.dialog.closeAll()
      this.messageLoading = ''
      this.spinDownload = false;
    }
  }

  bulkUpload() {
    if (!this.sPermission.canCreate(this.requiredPermissions) && this.requiredPermissions) return;
    this.router.navigateByUrl(this.bulkUploadROUTE);
  }

  gridUpload() {
    if (!this.sPermission.canCreate(this.requiredPermissions) && this.requiredPermissions) return;
    this.router.navigateByUrl(this.gridUploadROUTE);
  }

  new() {
    if (!this.sPermission.canCreate(this.requiredPermissions) && this.requiredPermissions) return;
    this.router.navigateByUrl(this.createROUTE);
  }

  goToUpdate(item: any) {
    if (!this.sPermission.canEdit(this.requiredPermissions) && this.requiredPermissions) return;
    if (this.editOnModal) {
      this.idEditable = item.id;
      this.messageEvent.emit(this.idEditable);
    } else {
      this.router.navigateByUrl(this.updateROUTE + item.id);
    }
  }

  async deleteItem() {
    if (!this.sPermission.canDelete(this.requiredPermissions) && this.requiredPermissions) return;
    // find index of item
    let index = this.dataSource.data.findIndex(
      (item) => item.id == this.objectSelect.id
    );

    if (index == -1) {
      this.sAlert.error('Record not found. Please reload the page.');
      return;
    }

    this.loading.start();
    await this.api
      .delete(this.deleteAPI + this.objectSelect.id)
      .then((result) => {
        if (result.status) {
          this.dataSource.data.splice(index, 1); // remova item from list
          this.setDataSourceAttributes()
          // this.changeDetectorRefs.detectChanges()

          this.sAlert.success(result.message);

          this.dialog.closeAll();
        } else {
          this.sAlert.error(result.message);
        }
      })
      .finally(() => {
        this.loading.stop();
      });
  }

  getTimeDownload(cant_record: number) {
    const total_time = this.time_download * cant_record;
    return (total_time / 60).toFixed(2);
  }

  openDialogDelete(item: any) {
    this.objectSelect = {id: item.id};
    if (this.modalDelete) {
      this.dialog.open(this.modalDelete);
    }
  }

  goToOption(option: OptionTable, item: any) {
    if (option.goTo != '') {
      this.router.navigateByUrl(option.goTo + item.id);
    } else {
      if (option.callback) {
        option.callback(item);
      }
    }
  }


}
