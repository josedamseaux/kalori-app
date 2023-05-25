import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Tab1Page } from './tab1.page';
import { Tab1PageRoutingModule } from './tab1-routing.module';
import { NavbarModule } from '../navbar/navbar.module';
import { ReversePipe } from '../pipes/reverse.pipe';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule,
    NavbarModule,
    PipesModule
  ],
  declarations: [Tab1Page],
})
export class Tab1PageModule {}
