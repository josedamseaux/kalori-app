import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(public alertController: AlertController, public router: Router, private dataService: DataService) { }


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
      text: 'Log out',
      role: 'logout',
      data: {
        action: 'logout',
      },
      handler: () => {
        this.logout()
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
  ];

  createObjective() {
    this.dataService.callSubjectToCreateDiet('create diet!');
  }

  setOpen(isOpen: boolean) {
    this.isActionSheetOpen = isOpen;
  }

  donateWithPayPal() {
    window.open('https://www.paypal.com/donate/?hosted_button_id=MLYMMB6G78J9Q')
  }

  logout() {

  }

  // 



  addButton() {
    console.log('clicked')
  }









  async buttonForAdding() {
    const alert = await this.alertController.create({
      header: 'Select training',
      buttons: [{
        text: 'OK', handler: async () => {
        },
      }],
      inputs: [
        {
          label: 'Bicep',
          type: 'textarea',
          value: 'Bicep',
        },
        // {
        //   label: 'Tricep',
        //   type: 'checkbox',
        //   value: 'Tricep',
        // },
        // {
        //   label: 'Chest',
        //   type: 'checkbox',
        //   value: 'Chest',
        // }
      ],
    })
    await alert.present()
    await alert.onDidDismiss()
      .then(async data => {
        console.log(data)
        // const date = new Date();
        // // Function to make all data lowercase
        // const lower = data.data.values.map(element => {
        //   return element.toLowerCase();
        // });

        // // Function to make first letter capital
        // lower[0] = lower[0].charAt(0).toUpperCase() + lower[0].substr(1);
        // let todaysDate = format(new Date(), "eeee")
        // this.dayTrained.musclesTrained = lower
        // this.dayTrained.dayTrained = format(date, 'dd.MM.yyyy')
        // this.dayTrained.Intensity = this.intensityTrained
        // let timeStamp = serverTimestamp()
        // Object.assign(this.dayTrained, { createdAt: timeStamp });
        // Object.assign(this.dayTrained, { dayOfWeekTrained: todaysDate });
      })
    // this.thirButtonForTrained()
  }



}
