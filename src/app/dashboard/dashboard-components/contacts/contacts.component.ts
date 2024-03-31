import { Component, OnInit } from '@angular/core';
import { Contact, contacts } from './contact-data';
import { MaterialModule } from 'src/app/material-module';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [MaterialModule, NgFor],
  templateUrl: './contacts.component.html'
})
export class ContactsComponent implements OnInit {

  contactsData: Contact[];

  constructor() {

    this.contactsData = contacts;
  }

  ngOnInit(): void {
  }

}
