import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Optional } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private router: Router, private platform: Platform, @Optional() private routerOutlet: IonRouterOutlet) {

    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.routerOutlet.canGoBack()) {
        App.exitApp();
      }
    });
  }

  ngOnInit() {
    this.router.navigate(['/tabs/tab1']);
  }
 

}
