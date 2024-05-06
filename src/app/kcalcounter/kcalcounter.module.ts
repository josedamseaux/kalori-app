import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';
import { KcalcounterComponent } from './kcalcounter.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    PipesModule,
  ],
  declarations: [KcalcounterComponent],
  exports: [KcalcounterComponent]

})
export class KcalcounterModule {}
