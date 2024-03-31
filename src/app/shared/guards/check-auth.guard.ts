import {CanActivateFn} from '@angular/router';

import {AuthService} from "../../core/auth/auth.service";
import {inject} from "@angular/core";
import {Router} from "@angular/router";

export const checkAuthGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService)
  const router = inject(Router)

  if (!authService.user()) {
    router.navigate(['login'])
    return false;
  }
  return true;

};
