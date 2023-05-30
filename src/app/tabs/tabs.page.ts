import { Component, ViewChild } from '@angular/core';
import { App } from '@capacitor/app';
import { IonTabs } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  
  @ViewChild(IonTabs, { static: true }) private ionTabs!: IonTabs;
  constructor(private platform: Platform){
    this.platform.backButton.subscribeWithPriority(-1, () => {
      if (!this.ionTabs.outlet.canGoBack()) {
        App.exitApp();
      }
    });
  }

}
