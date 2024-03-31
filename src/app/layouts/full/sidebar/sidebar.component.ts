import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {MenuItems} from '../../../shared/menu-items/menu-items';
import {MaterialModule} from 'src/app/material-module';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {SharedModule} from "../../../shared/shared.module";
import {UserModel} from "../../../shared/models/user.model";
import {AuthService} from "../../../core/auth/auth.service";
import {LocalStorageService} from "../../../shared/services/local-storage.service";
import {SessionConstant} from "../../../shared/constants/session.constant";
import {MatSidenav} from "@angular/material/sidenav";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MaterialModule, NgFor, NgIf, RouterModule, CommonModule, MatIconModule, SharedModule],
  templateUrl: './sidebar.component.html',
  styleUrls: []
})
export class AppSidebarComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  user: UserModel | undefined;

  private _mobileQueryListener: () => void;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    public authService: AuthService,
    public storageService: LocalStorageService
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 768px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }


  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.user = this.storageService.get(SessionConstant.USER);
  }

  logout() {
    this.authService.finalizeSession();
  }
}
