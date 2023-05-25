import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  credentials!: FormGroup

  constructor(private authService: AuthService,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private fb: FormBuilder,
              private router: Router) { 
              }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[ Validators.required, Validators.minLength(6)]]
    })
  }

  get email(){
    return this.credentials.get('email')
  }

  get password(){
    return this.credentials.get('password')
  }

  async register(){
    const loading = await this.loadingController.create();
    await loading.present()
    const user = await this.authService.register(this.credentials.value)
    await loading.dismiss()
 
    if(user){
      console.log('user registered')
      this.router.navigate(['/tabs/tab1']);
    } else {
      this.showAlert('Registration failed', 'please try again')
    }

  }

  async login(){
  	const loading = await this.loadingController.create();
		await loading.present();

		const user = await this.authService.login(this.credentials.value);
		await loading.dismiss();

		if (user) {
      console.log('user exist')
      this.router.navigate(['/tabs/tab1']);
		} else {
			this.showAlert('Login failed', 'Please try again!');
		}
    
  }

  
  async showAlert(header: string, message: string){
    const alert = await this.alertController.create({
			header,
			message,
			buttons: ['OK']
		});
		await alert.present();
	}
}