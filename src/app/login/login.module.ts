import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { LoginPageRoutingModule } from './login-routing.module';
import { AuthService } from '../services/auth.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule,
    
  ],
  declarations: [LoginComponent],
  providers: [AuthService]
})
export class LoginPageModule {}
