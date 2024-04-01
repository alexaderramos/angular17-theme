import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../../material-module";
import {ApiService} from "../../shared/services/api.service";
import {AlertService} from "../../shared/services/alert.service";
import {AuthService} from "../../core/auth/auth.service";
import {LoadingBarModule, LoadingBarService} from "@ngx-loading-bar/core";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule,
    LoadingBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm: FormGroup = new FormGroup<any>({
    username: new FormControl('', [Validators.required,]),
    password: new FormControl('', [Validators.required,])
  })

  loading:boolean =  false;


  CONFIG: any = {
    route: 'user'
  }
  constructor(
    private  api: ApiService,
    private alert: AlertService,
    private auth: AuthService,
    private loadingBar: LoadingBarService
  ) {
  }

  async login()
  {
    this.loading = true;
    this.startLoading();
    await this.api.post(`${this.CONFIG.route}/login`, this.loginForm.value)
      .then((res)=>{

        if(res.status)
        {
          this.alert.success("Bienvenido");
          setTimeout(()=>{
            this.auth.saveSession(res.data);
          },1000)
        }
        else
        {
          this.alert.error(res.message);
          this.clearPassword();
        }

      }).
      catch(err =>{
        // this.alert.error(err.error.message)
      })
      .finally(()=>{
        this.stopLoading();
        this.loading = false;
      })

  }

  clearPassword()
  {
    this.loginForm.get('password')?.setValue('')
  }

  startLoading() {
    this.loadingBar.start();
  }

  stopLoading() {
    this.loadingBar.complete();
  }
}
