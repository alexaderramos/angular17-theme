import { Injectable } from '@angular/core';
import {Subscription, timer} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AlertService {



  id: string = 'alert-container';

  max_time = 5000;

  constructor()
  { }

  verifyContainer()
  {
    let element = document.getElementById(this.id);

    if (!element)
    {
      let new_element = document.createElement('DIV');

      new_element.id = this.id;

      document.body.appendChild(new_element);

    }

  }

  success(message: string, title:string = "Correcto!" ,progress: boolean = true)
  {
    this.show(message, 'success', title,progress, 'fas fa-check-circle');
  }

  error(message: string, title:string = "Error!",progress: boolean = true)
  {
    if (message === undefined){
      message = "Ocurrió un error al intentar conectarse con el servidor, por favor intente nuevamente."
    }
    this.show(message, 'danger', title,progress, 'far fa-times-circle');
  }

  warning(message: string,title:string = "Atención!", progress: boolean = true)
  {
    this.show(message, 'warning',title, progress, 'fas fa-exclamation-triangle');
  }

  info(message: string, title:string = "Información",progress: boolean = true)
  {
    this.show(message, 'info', title,progress, 'fas fa-info-circle');
  }

  private show(message: string, type: string, title:string,progress: boolean, icon: string)
  {
    this.verifyContainer();

    let element = document.getElementById(this.id);

    if (element)
    {

      let new_element = document.createElement('DIV');
      let new_id = new Date().getTime() + 'alert';
      let transition_temp: Subscription = new Subscription();

      new_element.className = 'alert ' + type;

      new_element.id = new_id;

      new_element.addEventListener('click', () => {
        this.close(new_id, transition_temp);
      });

      let text_html = `
        <span>
          <i class="${icon} color-${type}"></i>
        </span>
        <div>
            <div class="title" style="font-size: 14px">
               ${title}
            </div>
            <div class="message" style="font-size: 12px">${message}</div>
        </div>`

      if (progress)
      {
        text_html += `<div id="${new_id}progress" class="progress-bar" > </div>`;
      }

      new_element.innerHTML = text_html;

      element.appendChild(new_element);

      this.startAnimation(new_id, transition_temp);
    }
  }

  startAnimation(id:string, transition_temp: Subscription)
  {
    let element = document.getElementById(id + 'progress');
    let count = 100;

    transition_temp = timer(0, 50).subscribe(() => {

      if (count <= 0)
      {
        this.close(id, transition_temp);
        return;
      }

      if (element)
      {
        element.style.width = count + '%';
      }

      count -= 1;

    });
  }

  close(id: string, transition_temp: Subscription)
  {
    if(transition_temp) transition_temp.unsubscribe();

    document.getElementById(id)?.remove();
  }

  destroy(element: HTMLElement)
  {
    element.remove();
  }
}
