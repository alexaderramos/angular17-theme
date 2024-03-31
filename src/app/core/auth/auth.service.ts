import {Injectable} from '@angular/core';
import {LocalStorageService} from "../../shared/services/local-storage.service";
import {Router} from "@angular/router";
import {SessionConstant} from "../../shared/constants/session.constant";
import {User} from "../../shared/models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _serviceStorage: LocalStorageService,
    private router: Router
  ) {
  }


  deleteCredentials() {
    this._serviceStorage.remove(SessionConstant.USER);
    this._serviceStorage.remove(SessionConstant.TOKEN);
    this._serviceStorage.remove(SessionConstant.PERMISSIONS);
  }

  saveSession(data: any) {
    this._serviceStorage.set(SessionConstant.USER, data);
    this._serviceStorage.set(SessionConstant.TOKEN, data.token);
    this._serviceStorage.set(SessionConstant.PERMISSIONS, data.permissions);

    this.router.navigateByUrl("/");

  }


  user() {

    const user: User = this._serviceStorage.get(SessionConstant.USER);
    return user;

  }

  permissions() {
    return this.user().permissions ?? [];
  }

  finalizeSession() {
    this.deleteCredentials();

    this.router.navigateByUrl("/login");
  }
}
