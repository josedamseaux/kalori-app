import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreateDietComponent } from './create-diet.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ],
  declarations: [CreateDietComponent],
  exports: [CreateDietComponent]
})
export class CreateDietModule {}
