import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private dataService: DataService) { }

  // Gear funcionality
  isRotated = false;

  rotateIcon() {
    this.isRotated = !this.isRotated;
  }

  isActionSheetOpen = false;

  public actionSheetButtons = [
    {
      text: 'Create diet objetive',
      role: 'create',
      data: {
        action: 'logout',
      },
      handler: () => {
        this.createObjective()
      }
    },
    {
      text: 'Donate with PayPal',
      data: {
        action: 'share',
      },
      handler: () => {
        console.log('clicked')
        this.donateWithPayPal()
      }
    },
    {
      text: 'FAQ',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
      handler: () => {
        this.logout()
      }
    },
    {
      text: 'Log out',
      role: 'logout',
      data: {
        action: 'logout',
      },
      handler: () => {
        this.logout()
      }
    },
  ];

  setOpen(isOpen: boolean) {
    this.isActionSheetOpen = isOpen;
  }

  createObjective(){
      this.dataService.callSubjectToCreateDiet('create diet!');
  }

  donateWithPayPal() {
    window.open('https://www.paypal.com/donate/?hosted_button_id=MLYMMB6G78J9Q')
  }

  logout() {

  }

  // 




}
