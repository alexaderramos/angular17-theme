import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {UserModel} from "../../../shared/models/user.model";
import {LocalStorageService} from "../../../shared/services/local-storage.service";
import {SessionConstant} from "../../../shared/constants/session.constant";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent implements OnInit {

  user: UserModel | undefined;

  constructor(
    private authService: AuthService,
    private storageService: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    this.user = this.storageService.get(SessionConstant.USER);
    console.log('this.user:>>', this.user)
  }

  logout() {
    this.authService.finalizeSession();
  }


}
