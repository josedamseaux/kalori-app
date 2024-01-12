import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {

  constructor(public alertController: AlertController,
    public router: Router, private dataService: DataService,
    private authService: AuthService) { }

  isRotated = false;
  isActionSheetOpen = false;
  showCreateDietButton = false;
  title = ''
  
  ngOnInit() {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showCreateDietButton = event.url.includes('/tabs/tab2');
      setTimeout(() => {
        let element = document.getElementsByClassName('action-sheet-button')[0];
        element.setAttribute('style', 'display:none;');
      }, 450);
      if (event.url.includes('/tabs/tab1')) {
        this.title = 'Kalori app'
      } else {
        this.title = 'My diet'
      }

    });
  }

  rotateIcon() {
    this.isRotated = !this.isRotated;
  }

  public actionSheetButtons = [
    {
      text: 'Create diet objetive',
      role: 'create',
      handler: () => {
        console.log('clicked')
        this.dataService.subjectToOpenDietCreator.next('create diet!');
      }
    },
    {
      text: 'Donate with PayPal',
      handler: () => {
        window.open('https://www.paypal.com/donate/?hosted_button_id=MLYMMB6G78J9Q')
      }
    },
    {
      text: 'Log out',
      role: 'logout',
      handler: () => {
        this.authService.logout()
        this.router.navigate(['/login'])
      }
    },
    {
      text: 'FAQ',
      role: 'cancel',
      handler: () => {
        this.FAQ()
      }
    },
  ];

  setOpen(isOpen: boolean) {
    this.isActionSheetOpen = isOpen;
  }

  async FAQ(){
  //     const alert = await this.alertController.create({
  //       header: 'Add meal',
  //       buttons: [{
  //         text: 'Add another', handler: async (data) => {
  //         },
  //       },
  //       {
  //         text: 'Done', handler: async (data) => {
  //         },
  //       },
  //     ],
  //       inputs: [
  //         {
  //           name: 'meal',
  //           placeholder: 'E.g., eggs, broccoli, bread',
  //           type: 'text',
  //         },
  //         {
  //           name: 'kcal',
  //           placeholder: 'Calories',
  //           type: 'number',
  //         }
  //       ],
  //     });
  
  //     await alert.present()
  //     await alert.onDidDismiss()
  }


}
