import {Injectable} from '@angular/core';
import {AuthService} from "../../core/auth/auth.service";
import {LocalStorageService} from "./local-storage.service";
import {AlertService} from "./alert.service";
import {PermissionConstant} from "../constants/permission.constant";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {


  private permissions: string[] = []
  private FULL_ACCESS: string = '*'


  public VIEW = ''
  public EDIT = ''
  public CREATE = ''
  public DELETE = ''
  public DOWNLOAD = ''

  constructor(
    private auth: AuthService,
    private storage: LocalStorageService,
    private sAlert: AlertService,
  ) {

    this.permissions = this.auth.permissions()
  }


  generatePermissionNames(moduleName: string, subModuleName: string) {
    this.CREATE = `${moduleName}.${subModuleName}.${PermissionConstant.CREATE}`
    this.VIEW = `${moduleName}.${subModuleName}.${PermissionConstant.VIEW}`
    this.EDIT = `${moduleName}.${subModuleName}.${PermissionConstant.EDIT}`
    this.DELETE = `${moduleName}.${subModuleName}.${PermissionConstant.DELETE}`
    this.DOWNLOAD = `${moduleName}.${subModuleName}.${PermissionConstant.DOWNLOAD}`

    console.log(
      this.CREATE + '->' + this.canCreate(),
      this.VIEW + '->' + this.canView(),
      this.EDIT + '->' + this.canEdit(),
      this.DELETE + '->' + this.canDelete(),
      this.DOWNLOAD + '->' + this.canDownload(),
    )
  }

  canCreate(alert: boolean = false) {
    return this.can(this.CREATE, alert)
  }

  canCreateOrEdit(alert: boolean = false) {
    return this.canSome([this.CREATE, this.EDIT], alert)
  }

  canView(alert: boolean = false) {
    return this.can(this.VIEW, alert)
  }

  canEdit(alert: boolean = false) {
    return this.can(this.EDIT, alert)
  }

  canDownload(alert: boolean = false) {
    return this.can(this.DOWNLOAD, alert)
  }

  canDelete(alert: boolean = false) {
    return this.can(this.DELETE, alert)
  }


  /**
   * Verifica si tiene un permiso
   * @param requiredPermission
   * @param alert
   */
  can(requiredPermission: string, alert: boolean = false) {

    if (this.permissions.includes(requiredPermission) || this.canFullAccess()) {
      return true; // Permite el acceso a la ruta si el permiso requerido está en la lista de permisos
    } else {
      if (alert) {
        this.sAlert.error('No access allowed', 'FORBIDDEN')
      }
      return false
    }
  }

  canFullAccess() {
    return this.permissions.includes(this.FULL_ACCESS)
  }


  canSome(requiredPermission: string[], alert: boolean = false): boolean {
    const can = this.permissions.some(elemento => requiredPermission.includes(elemento)) || this.canFullAccess();
    if (!can && alert) {
      this.sAlert.error('No access allowed', 'FORBIDDEN')
    }
    return can
  }

  canEvery(requiredPermission: string[], alert: boolean = false): boolean {
    const can = this.permissions.every(elemento => requiredPermission.includes(elemento) || this.canFullAccess());
    if (!can && alert) {
      this.sAlert.error('No access allowed', 'FORBIDDEN')
    }
    return can;
  }
}
