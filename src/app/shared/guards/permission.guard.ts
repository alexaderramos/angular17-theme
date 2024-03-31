import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../../core/auth/auth.service";

export const permissionGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)
  const router = inject(Router)


  const requiredPermission = route.data['permission']; // Obtiene el permiso requerido de la ruta

  const fullAccess = '*';

  const permissions = auth.permissions()

  console.log(permissions)

  // const permissions = JSON.parse(localStorage.getItem('permissions')) || []; // Obtiene los permisos del localStorage
  if (permissions.includes(requiredPermission) || permissions.includes(fullAccess)) {
    return true; // Permite el acceso a la ruta si el permiso requerido está en la lista de permisos
  }
  // Redirige a la ruta '/forbidden' si el permiso requerido no está presente
  return router.parseUrl('/forbidden');

};
