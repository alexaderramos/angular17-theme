import { Component, OnInit } from '@angular/core';
import { MaterialModule } from 'src/app/material-module';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
