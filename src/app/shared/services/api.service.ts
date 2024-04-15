import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment} from "../../../enviroments/enviroment";
import {Subject, takeUntil} from "rxjs";
import {AuthService} from "../../core/auth/auth.service";
import {LocalStorageService} from "./local-storage.service";
import {AlertService} from "./alert.service";
import {SessionConstant as cSESSION} from "../constants/session.constant";
import {Params} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  private unsubscribe$ = new Subject<void>();
  urlServer: string = environment.server;
  headers: HttpHeaders|undefined;
  token: string = '';

  constructor(
    private auth: AuthService,
    private storage: LocalStorageService,
    private alertService: AlertService,
    private http: HttpClient
  ) {

    //this.setToken();
  }

  private setToken() {
    this.token = this.storage.get(cSESSION.TOKEN);

    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
  }


  async get(url: string, params?: Params): Promise<any> {
    this.unsubscribe$ = new Subject<void>();

    try {

      const res = await this.http.get(this.urlServer + url,
        {
          headers: this.headers,
          params: params
        })
        .pipe(takeUntil(this.unsubscribe$)) // Cancela la petición cuando unsubscribe$ emita un valor
        .toPromise();
      return Promise.resolve(res);
    } catch (error: any) {
      if (error.status == 401) {
        return this.auth.finalizeSession();
      }
      return Promise.reject(error);
    } finally {
      // Completa y desecha el Subject después de la solicitud
      if (this.unsubscribe$) {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
      }
    }

  }


  async post(url: string, data: any): Promise<any> {

    try {

      const res = await this.http.post(this.urlServer + url, data, {headers: this.headers}).toPromise();

      return Promise.resolve(res);

    } catch (error) {

      return  this.resolveError(error)


    }

  }

  async put(url: string, data: any): Promise<any> {

    try {

      const res = await this.http.put(this.urlServer + url, data, {headers: this.headers}).toPromise();

      return Promise.resolve(res);

    } catch (error) {

      return  this.resolveError(error)
    }

  }

  async delete(url: string): Promise<any> {

    try {

      const res = await this.http.delete(this.urlServer + url, {headers: this.headers}).toPromise();

      return Promise.resolve(res);

    } catch (error) {

      return  this.resolveError(error)
    }

  }

  download(route: string, fileName: (string|null) = null, data: any): Promise<any> {

    return new Promise((resolve, reject) => {

      this.http.post(this.urlServer + route, data,
        {
          responseType: 'blob',
          observe: 'response',
          headers: this.headers
        }
      ).subscribe((data: HttpResponse<any>) => {
        var contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        var blob = new Blob([data.body], {type: contentType});
        var url = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = fileName ?? 'download';
        link.click();
        resolve(true);
      }, (err) => {
        reject(err);
      });
    });
  }

  downloadFile(route: string, filename: string|null = null, data: any, typeFile: string = 'application/pdf'): Promise<any> {


    return new Promise((resolve, reject) => {
      this.http.post(this.urlServer + route, data,
        {
          responseType: 'blob' as 'json',
          observe: 'response',
          headers: this.headers
        }
      ).subscribe((response: HttpResponse<any>) => {

        let blob = new Blob([response.body], {type: typeFile});

        var downloadURL = window.URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.href = downloadURL;
        link.download = filename ?? 'download';
        link.click();

        let res = {
          success: true,
          info: null,
          message: 'Generado correctamente.'
        }

        resolve(res);

      }, (err) => {
        reject(err);
      });
    });
  }

  resolveError(error: any) {
    if (error.status == 401){
      return this.auth.finalizeSession()
    }
    if(error.status == 403)	return this.alertService.error("You don't have permission to access this resource", "Forbidden access");

    if (error.status == 422) {
      let message = error.error.message;
      if (error.error.errors) {
        let errors = Object.keys(error.error.errors).map((key) => {
          return error.error.errors[key];
        });
        message = errors.join('<br>');
      }
      return this.alertService.error(message);
    }

    return Promise.reject(error);
  }


  // **********************************************************************

  ngOnDestroy(): void {
    this.cancelPendingRequests()
  }

  cancelPendingRequests() {
    this.unsubscribe$.next(); // Emitir un valor en unsubscribe$ cancelará las peticiones pendientes
    this.unsubscribe$.complete(); // Completa el Subject para evitar fugas de memoria
  }
}
