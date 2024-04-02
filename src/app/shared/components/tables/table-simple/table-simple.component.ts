import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Column} from "../../../interfaces/column";
import {OptionTable} from "../../../interfaces/option-table";
import {TableStylesConstant} from "../../../constants/table-styles.constant";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ApiService} from "../../../services/api.service";
import {LoadingBarService} from "@ngx-loading-bar/core";
import {AlertService} from "../../../services/alert.service";
import {PermissionService} from "../../../services/permission.service";
import {MaterialModule} from "../../../../material-module";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {NgSelectModule} from "@ng-select/ng-select";
import {FilterOnePipe} from "../../../pipes/filter-one.pipe";
import {TableSortDirective} from "../../../directives/table-sort.directive";
import {NgxPaginationModule} from "ngx-pagination";
import {TableItemComponent} from "../table-item/table-item.component";

@Component({
  selector: 'app-table-simple',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgSelectModule,
    FilterOnePipe,
    TableSortDirective,
    NgClass,
    NgxPaginationModule,
    NgForOf,
    TableItemComponent
  ],
  templateUrl: './table-simple.component.html',
  styleUrl: './table-simple.component.scss'
})
export class TableSimpleComponent implements OnInit, OnDestroy {
  timeDownload: number = 0.080
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
  campaignOne: FormGroup | undefined;
  @Input() columns: Column[] = [];
  @Input() listData: any[] = [];
  @Input() options: OptionTable[] = [];
  @Input() newUrl: string = '';
  @Input() getDataUrl: string = '';
  @Input() newUrlMessage: string = '';
  @Input() updateUrl: string = '';
  @Input() deleteUrl: string = '';
  @Input() downloadUrl: string = '';
  @Input() nameModel: string = '';
  @Input() moduleName: string = '';
  @Input() submoduleName: string = '';
  @Input() classHeight: string = '';
  @Input() viewingPaginate: string = 'registros';
  @Input() bulkUploadUrl: string = '';
  @Input() gridUploadUrl: string = '';
  @Input() showFilter: boolean = true;
  @Input() showFilterDate: boolean = false;
  @Input() showFilter_inputs: boolean = true;
  @Input() actionFixed: boolean = false;
  @Output() onLoadData = new EventEmitter<string>();
  @Input() requiredPermissions: boolean = true;

  @ViewChild('modal_view') modal_view: TemplateRef<any> | undefined;
  @ViewChild('delete_item') delete_item: TemplateRef<any> | undefined;
  @ViewChild('modal_loading') modal_loading: TemplateRef<any> | undefined;
  @ViewChild('modal_information') modal_information: TemplateRef<any> | undefined;
  messageLoading: string = '';
  messageInformation: string = '';

  tableStyles: any = TableStylesConstant;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private sApi: ApiService,
    private loading: LoadingBarService,
    private sAlert: AlertService,
    public sPermission: PermissionService
  ) {
  }

  async ngOnInit() {
    this.sPermission.generatePermissionNames(this.moduleName, this.submoduleName)


    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaignOne = new FormGroup({
      start: this.showFilterDate
        ? new FormControl(new Date(year, month, 1))
        : new FormControl(null),
      end: this.showFilterDate
        ? new FormControl(new Date(year, month, today.getDate()))
        : new FormControl(null),
    });

    await this.getData()

    if (this.columns.length > 0) {
      let filter = this.columns.findIndex((x) => x.filter);
      this.filterBy = filter;
      if (filter != -1) {
        this.filterByModel = this.columns[filter];
      }
    }
  }

  async getData() {
    if (!this.sPermission.canView() && this.requiredPermissions) return;

    if (this.loadingData) {
      this.sAlert.warning('Espere un momento, se está cargando la información');
      return;
    }

    this.loadingData = true;
    await this.sApi.get(`${this.getDataUrl}`)
      .then((res) => {

        if (res.status) {
          this.columns = res.data.columns;
          this.listData = res.data.data;
          this.onLoadData.emit(res.data)

        }
      })
      .finally(() => this.loadingData = false);
  }

  bulkUpload() {
    if (!this.sPermission.canCreate(this.requiredPermissions) && this.requiredPermissions) return;
    this.router.navigateByUrl(this.bulkUploadUrl);
  }

  gridUpload() {
    if (!this.sPermission.canCreate(this.requiredPermissions) && this.requiredPermissions) return;
    this.router.navigateByUrl(this.gridUploadUrl);
  }

  new() {
    if (!this.sPermission.canCreate(this.requiredPermissions) && this.requiredPermissions) return;
    if (this.newUrl === '') {
      this.messageInformation = this.newUrlMessage

      if (this.modal_information) {
        this.dialog.open(this.modal_information, {disableClose: false});
      }

    } else {
      this.router.navigateByUrl(this.newUrl);
    }
  }

  filterConfig(items: any[], searchFilter: string, keyFilter: Column) {
    if (!items) return [];

    if (!keyFilter) return items;

    if (!searchFilter) return items;

    let searchFilterNormalize = this.normalizeCase(searchFilter);

    if (keyFilter.second_id !== '') {
      return items.filter((x) =>
        this.normalizeCase(x[keyFilter.id][keyFilter.second_id]).includes(
          searchFilterNormalize
        )
      );
    }

    return items.filter((x) =>
      this.normalizeCase(x[keyFilter.id]).includes(searchFilterNormalize)
    );
  }

  normalizeCase(stringValue: string) {
    return stringValue
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  selectAll(results: any []) {

    this.listDataFilter = results;

    let value = this.checkboxAll;
    let listFilter = this.filterConfig(
      this.listData,
      this.filterSearch,
      this.filterByModel
    );
    let exists;

    this.checkboxUnd = false;
    this.listData.forEach((element) => {
      exists = listFilter.find((x) => x.id === element.id);

      if (exists) element.check = value;
    });


    if (this.listDataFilter.length == 0) {
      // listFilter = listFilter.filter((x) => x.check == true);
      this.sAlert.info(`No hay registros para seleccionar`);
    } else {
      listFilter = this.listDataFilter.filter((x) => x.check == true);
      if (listFilter.length == 0) return;
      this.sAlert.info(`Has seleccionado ${listFilter.length} registros`);
    }

  }

  verifyChecked() {
    let value = 1;
    let cont = 0;
    let listFilter = this.filterConfig(
      this.listData,
      this.filterSearch,
      this.filterByModel
    );
    let exists;

    this.checkboxUnd = false;
    for (const element of this.listData) {
      exists = listFilter.find((x) => x.id === element.id);

      if (!exists) continue;
      if (!element.check) {
        value = 0;
        cont++;
      }
    }

    if (cont == listFilter.length) {
      this.checkboxAll = false;
    } else if (value == 0 && cont != listFilter.length) {
      this.checkboxUnd = true;
    } else {
      this.checkboxAll = true;
    }

    if (this.listDataFilter.length == 0) {
      // listFilter = listFilter.filter((x) => x.check == true);
      this.sAlert.info(`No hay registros para seleccionar`);
    } else {
      listFilter = this.listDataFilter.filter((x) => x.check == true);
      if (listFilter.length == 0) return;
      this.sAlert.info(`Has seleccionado ${listFilter.length} registros`);
    }

  }

  goToUpdate(item: any) {
    if (!this.sPermission.canEdit(this.requiredPermissions) && this.requiredPermissions) return;
    this.router.navigateByUrl(this.updateUrl + item.id);
  }

  async deleteItem() {

    if (!this.sPermission.canDelete(this.requiredPermissions) && this.requiredPermissions) return;

    // find index of item
    let index = this.listData.findIndex(item => item.id == this.objectSelect.id);

    if (index == -1) {
      this.sAlert.error("Registro no encontrado, recargue la página e intente nuevamente");
      return
    }

    let startDate = null;
    let endDate = null;

    if (this.campaignOne) {
      startDate = this.getDateFromStringDate(this.campaignOne.value.start);
      endDate = this.getDateFromStringDate(this.campaignOne.value.end);
    }
    // return;


    this.reloadDateRange();

    this.loading.start();
    await this.sApi
      .delete(this.deleteUrl + this.objectSelect.id)
      .then((result) => {
        if (result.status) {
          this.listData.splice(index, 1);
          this.sAlert.success(result.message);
          this.positionFirstPage()

          this.dialog.closeAll();
        } else {
          this.sAlert.error(result.message);
        }
      })
      .finally(() => {
        // TODO: Force reload listData
        this.campaignOne = new FormGroup({
          start: this.showFilterDate
            ? new FormControl(startDate)
            : new FormControl(null),
          end: this.showFilterDate
            ? new FormControl(endDate)
            : new FormControl(null),
        });

        this.loading.stop();
      });
  }

  reloadDateRange() {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    this.campaignOne = new FormGroup({
      start: this.showFilterDate
        ? new FormControl(new Date(year, month, 1))
        : new FormControl(null),
      end: this.showFilterDate
        ? new FormControl(new Date(year, month, today.getDate()))
        : new FormControl(null),
    });
  }

  getDateFromStringDate(str: string | undefined) {

    if (str == undefined || str == '') {
      return null;
    }

    let dateObjet = new Date(str);
    let date = JSON.stringify(dateObjet)
    date = date.slice(1, 11)

    let k = date.split('-');

    let year = parseInt(k[0]), month = parseInt(k[1]), day = parseInt(k[2]);
    return new Date(year, month - 1, day);
  }

  openDialogDelete(item: any) {

    if (!this.sPermission.canDelete(this.requiredPermissions) && this.requiredPermissions) return;

    this.objectSelect = {id: item.id};
    if (this.delete_item) {
      this.dialog.open(this.delete_item);
    }
  }

  positionFirstPage() {
    if (this.currentPage != 1) {
      this.currentPage = 1;
    }
  }

  calculateNumberRecords(results: any []) {
    return (
      this.minRegTable -
      (results.length - this.itemsPerPage * (this.currentPage - 1))
    );
  }

  goToOption(option: OptionTable, item: any) {

    if (this.sPermission.canSome(option.permission, true))

      if (option.goTo != '') {
        this.router.navigateByUrl(option.goTo + item.id);
      } else if (option.callback) {
        option.callback(item);
      }
  }

  sorting(item: any) {
    let id = item.id;
    let type = item.type
    // item. =  item.;
  }

  getTimeDownload(totalRecords: number) {
    const totalTime = this.timeDownload * totalRecords;
    return (totalTime / 60).toFixed(2);
  }

  openDialog() {
    if (this.modal_view) {
      this.dialog.open(this.modal_view);
    }
  }

  identifyTrack(index: number, item: any) {
    return item.id;
  }

  setFilterByModel() {

    if (this.filterBy > -1 && this.filterBy < this.columns.length) {
      this.filterByModel = this.columns[this.filterBy];
    }
  }

  async download() {

    if (!this.sPermission.canDownload(this.requiredPermissions) && this.requiredPermissions) return;

    if (!this.checkboxAll && !this.checkboxUnd) {
      return this.sAlert.error('No ha seleccionado ningún registro');
    }

    if (this.spinDownload) return this.sAlert.warning('Ya se está descargando, espere un momento');

    this.spinDownload = true;
    if (this.modal_loading) {
      this.dialog.open(this.modal_loading, {disableClose: true});
    }
    this.messageLoading = 'Estamos preparando su descarga...';

    try {
      let listFilter = this.filterConfig(
        this.listData,
        this.filterSearch,
        this.filterByModel
      );

      if (this.listDataFilter.length == 0) {
        listFilter = listFilter.filter((x) => x.check == true);
      } else {
        listFilter = this.listDataFilter.filter((x) => x.check == true);
      }
      console.log(listFilter)

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
      //this.message_loading += ' Estimated time: ' time + 'minutes';

      let date = new Date();
      let name = `REPORT ${this.nameModel.toUpperCase()} ${date.getDate()}${
        date.getMonth() + 1
      }${date.getFullYear()}.xlsx`;

      let column_select = this.columns.reduce((array: any[], ele) => {
        if (ele.display) {
          array.push(ele);
        }
        return array;
      }, []);

      await this.sApi
        .download(this.downloadUrl, name, {
          columns: column_select,
          data: new_array,
        })
        .finally(() => (this.spinDownload = false));
    } catch (error) {
      this.sAlert.error('Un error ha ocurrido durante la descarga, intente nuevamente en unos minutos');
      console.log(error);
    } finally {
      this.dialog.closeAll()
      this.messageLoading = ''
      this.spinDownload = false;
    }
  }

  ngOnDestroy(): void {
    this.sApi.cancelPendingRequests();
  }

}
