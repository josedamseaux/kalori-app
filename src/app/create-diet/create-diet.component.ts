import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { userDietData } from '../share/interfaces/userDietData';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-create-diet',
  templateUrl: './create-diet.component.html',
  styleUrls: ['./create-diet.component.scss'],
})
export class CreateDietComponent implements OnInit {

  
  constructor(public alertController: AlertController,
    private dataService: DataService,
    private toastController: ToastController) {
    }
    
    private subscription: Subscription | undefined;

  ngOnInit() { 
    this.subscription = this.dataService.getSubjectToCreateDiet().subscribe(data => {
      if(data){
        this.firstButtonForCreateDiet()
      }
  })
  }

  async firstButtonForCreateDiet() {
    const alert = await this.alertController.create({
      header: 'Lets calculate your Basal Metabolic Rate (BMR)',
      buttons: [
        {
          text: 'Whats BMR?',
          role: 'ok',
          handler: () => {
            alert.dismiss()
            this.whatsBMR()
          },
        },
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {
            alert.dismiss()
            this.secondButtonForCreateDiet()
          },
        },
      ],
    });
    await alert.present();
  }

  async whatsBMR() {
    const alert = await this.alertController.create({
      header: `Your Basal Metabolic Rate (BMR) is the number of calories you burn as 
                your body performs basic (basal) life-sustaining function. 
                Commonly also termed as Resting Metabolic Rate (RMR), 
                which is the calories burned if you stayed in bed all day.`,

      buttons: [
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {
            alert.dismiss()
            this.secondButtonForCreateDiet()
          },
        },
      ],
      cssClass: 'whats-brm'

    });
    await alert.present();
  }

  tmbForUser: userDietData = {
    weight: 0,
    height: 0,
    age: 0,
    tmb: 0,
    objective: ''
  }

  required: boolean = true

  async secondButtonForCreateDiet() {
    const alert = await this.alertController.create({
      header: 'Calculate Basal Metabolic Rate',
      buttons: [{
        text: 'OK', handler: async (data) => {

          if (data.weight == '' || data.height == '' || data.age == '') {
            this.presentToast()
            this.secondButtonForCreateDiet()
          }

          if (data.weight != '' && data.height != '' && data.age != '') {
            this.required = false
            this.thirButtonForTrained()
          }

        },
      }],
      inputs: [
        {
          name: 'weight',
          placeholder: 'Weight in kg',
          type: 'number',
        },
        {
          name: 'height',
          placeholder: 'Height in cm',
          type: 'number',
        },
        {
          name: 'age',
          placeholder: 'Age',
          type: 'number',
          max: 99
        },
      ],
    })
    await alert.present()
    await alert.onDidDismiss()
      .then(async data => {

        this.tmbForUser.weight = data.data.values.weight
        this.tmbForUser.height = data.data.values.height
        this.tmbForUser.age = data.data.values.age
        this.tmbForUser.tmb = (10 * data.data.values.weight) +
          (6.25 * data.data.values.height) -
          (5 * data.data.values.age) + 5
        console.log(this.tmbForUser)

      })
  }

  async presentToast() {
    let toast = await this.toastController.create({
      message: "field(s) cannot be empty",
      duration: 3000,
      position: "middle"
    });
    await toast.present();
  }

  async thirButtonForTrained() {
    console.log(this.tmbForUser)

    const alert2 = await this.alertController.create({
      // header: `Your Basal Metabolic Rate is ${this.tmbForUser.tmb}  ! What's your objective?`,
      header: `What's your objective?`,

      buttons: [
        {
          text: 'caloric surplus (to gain weight)',
          role: 'surplus',
          handler: () => {
            this.tmbForUser.objective = 'surplus';
          },
        },
        {
          text: 'caloric deficit (to lose weight)',
          role: 'deficit',
          handler: () => {
            this.tmbForUser.objective = 'deficit';
          },
        },
      ],
    });
    await alert2.present()
    await alert2.onDidDismiss();
    console.log(this.tmbForUser)

  }


}
