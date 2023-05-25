import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Tab2Page } from './tab2.page';
import { Tab2PageRoutingModule } from './tab2-routing.module';
import { CreateDietModule } from '../create-diet/create-diet.module';
import { NavbarModule } from '../navbar/navbar.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab2PageRoutingModule,
    NavbarModule,
    CreateDietModule,
  ],
  declarations: [Tab2Page]
})
export class Tab2PageModule {}
