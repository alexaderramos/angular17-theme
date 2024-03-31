import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../../core/auth/auth.service";

export const checkLoginGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)
  const router = inject(Router)

  if (auth.user()) {
    router.navigate(['/dashboard']);
    return false;
  }
  return true;
};
