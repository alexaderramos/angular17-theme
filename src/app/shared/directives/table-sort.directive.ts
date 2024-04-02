import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';
import {Sort} from "../../util/sort";

@Directive({
  selector: '[appTableSort]',
  standalone: true
})
export class TableSortDirective {

  @Input() appTableSort: Array<any> | undefined;

  constructor(private rendered: Renderer2, private targetElement: ElementRef) {}

  @HostListener('click')
  sortData() {
    const sort = new Sort();

    const element = this.targetElement.nativeElement;

    const order = element.getAttribute('data-order');

    const type = element.getAttribute('data-type');

    const id = element.getAttribute('data-id');
    const second_id = element.getAttribute('data-second_id');

    this.appTableSort?.sort(sort.startSort(id, second_id,order, type));



    Array.from(document.querySelectorAll('.sort-asc')).forEach((e) => {
      e.classList.remove('sort-asc');
    });
    Array.from(document.querySelectorAll('.sort-desc')).forEach((e) => {
      e.classList.remove('sort-desc');
    });

    if (order === 'desc') {
      element.setAttribute('data-order', 'asc');
      element.classList.remove('sort-asc');
      element.classList.add('sort-desc');
    } else {
      element.setAttribute('data-order', 'desc');
      element.classList.remove('sort-desc');
      element.classList.add('sort-asc');
    }
  }

}
