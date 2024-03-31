import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {LocalStorageService} from "../services/local-storage.service";
import {SessionConstant} from "../constants/session.constant";

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const storage = inject(LocalStorageService)

  const token = storage.get(SessionConstant.TOKEN);
  req = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(req);
};
