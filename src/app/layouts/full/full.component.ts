import { MediaMatcher } from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnDestroy, AfterViewInit, Renderer2, ViewChild} from '@angular/core';
import { MenuItems } from '../../shared/menu-items/menu-items';
import {MatSidenav} from "@angular/material/sidenav";


/** @title Responsive sidenav */
@Component({
  selector: 'app-full-layout',
  templateUrl: 'full.component.html',
  styleUrls: []
})
export class FullComponent implements OnDestroy, AfterViewInit {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
  @ViewChild('snav') sidenav!: MatSidenav

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public menuItems: MenuItems,
    private renderer: Renderer2
  ) {
    this.mobileQuery = media.matchMedia('(min-width: 1024px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngAfterViewInit() {
    this.renderer.setStyle(this.sidenav._content.nativeElement,  'scrollbar-width', 'none')
  }
}
