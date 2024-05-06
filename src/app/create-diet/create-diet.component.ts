import { Component, Injectable, OnInit } from '@angular/core';
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

  public subscription!: Subscription;

  userCaloriesInfo: userDietData = {
    weight: 0,
    height: 0,
    age: 0,
    gender: '',
    calorieMaintence: 0,
    activityLevel: '',
    objective: '',
    percentage: 0,
    target: 0,
    random: 0
  }

  required: boolean = true

  ngOnInit() {
    this.subscription = this.dataService.subjectToOpenDietCreator$
      .subscribe(data => {
        console.log(data)
        if (data == 'create diet!') {
          this.firstButtonForCreateDiet()
        }
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  async whatsCalorieMaintence() {
    const alert = await this.alertController.create({
      header: `Calculating maintenance calories is essential to establish a baseline in calorie intake planning. 
      If you consume the same amount of calories as you burn, your weight should remain stable. 
      If you consume more calories than you burn, you may experience weight gain, and if you consume fewer calories, you may lose weight.`,
      cssClass: 'whats-brm',
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
    });
    await alert.present();
  }

  async presentToast() {
    let toast = await this.toastController.create({
      message: "field(s) cannot be empty",
      duration: 3000,
      position: "middle"
    });
    await toast.present();
  }

  async firstButtonForCreateDiet() {
    const alert = await this.alertController.create({
      header: 'Lets calculate your maintenance calories',
      buttons: [
        {
          text: 'Whats BMR?',
          role: 'ok',
          handler: () => {
            alert.dismiss()
            this.whatsCalorieMaintence()
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

  async secondButtonForCreateDiet() {
    const alert2 = await this.alertController.create({
      header: `Select gender`,
      buttons: [
        {
          text: 'Male',
          role: 'male',
          handler: () => {
            this.userCaloriesInfo.gender = 'male';
            this.thirdButtonForCreateDiet()

          },
        },
        {
          text: 'Female',
          role: 'female',
          handler: () => {
            this.userCaloriesInfo.gender = 'female';
            this.thirdButtonForCreateDiet()
          },
        },
      ],
    });
    await alert2.present()
    await alert2.onDidDismiss();
  }

  async thirdButtonForCreateDiet() {
    const alert = await this.alertController.create({
      header: 'Calculate Calorie Maintence',
      buttons: [{
        text: 'OK', handler: async (data) => {
          if (data.weight == '' || data.height == '' || data.age == '') {
            this.presentToast()
            this.secondButtonForCreateDiet()
          }

          if (data.weight != '' && data.height != '' && data.age != '') {
            this.required = false
            this.fourthButtonForTrained()
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
        this.userCaloriesInfo.weight = data.data.values.weight
        this.userCaloriesInfo.height = data.data.values.height
        this.userCaloriesInfo.age = data.data.values.age
      })
  }

  async fourthButtonForTrained() {
    const alert2 = await this.alertController.create({
      // header: `Your Basal Metabolic Rate is ${this.tmbForUser.tmb}  ! What's your objective?`,
      header: `What's your objective?`,
      buttons: [
        {
          text: 'caloric surplus (to gain weight)',
          role: 'surplus',
          handler: () => {
            this.userCaloriesInfo.objective = 'surplus';
          },
        },
        {
          text: 'caloric deficit (to lose weight)',
          role: 'deficit',
          handler: () => {
            this.userCaloriesInfo.objective = 'deficit';
          },
        },
      ],
    });
    await alert2.present()
    await alert2.onDidDismiss();
    this.fifthButtonForTrained()
  }

  async fifthButtonForTrained() {
    const alert2 = await this.alertController.create({
      // header: `Your Basal Metabolic Rate is ${this.tmbForUser.tmb}  ! What's your objective?`,
      header: `How much would you like to go with the diet?`,
      cssClass: 'select-percentage',
      buttons: [{
        text: 'OK', handler: async (data) => {
          this.userCaloriesInfo.percentage = data
        },
      }],
      inputs: [
        {
          placeholder: 'Moderate',
          type: 'radio',
          value: 0.1,
          label: 'Moderate',
        },
        {
          placeholder: 'Intense',
          type: 'radio',
          value: 0.19,
          label: 'Intense',
        },

      ],
    });
    await alert2.present()
    await alert2.onDidDismiss();
    this.sixthButtonForTrained()


  }

  async sixthButtonForTrained() {
    const alert2 = await this.alertController.create({
      header: `Select activity level`,
      subHeader: 'It is recommended going for a steady 10%',
      cssClass: 'select-percentage',
      buttons: [{
        text: 'OK', handler: async (value) => {
          this.userCaloriesInfo.activityLevel = value
        },
      }],
      inputs: [
        {
          placeholder: 'Sedentary',
          type: 'radio',
          value: 'sedentary',
          label: 'Sedentary',
        },
        {
          placeholder: 'Moderate',
          type: 'radio',
          value: 'moderate',
          label: 'Moderate',
        },
        {
          placeholder: 'Active',
          type: 'radio',
          value: 'active',
          label: 'Active',
        },
      ],
    });
    await alert2.present()
    await alert2.onDidDismiss();

    console.log(this.userCaloriesInfo)

    this.calculateCalories()
  }

  calculateCalories() {

    let activityFactor;

    if (this.userCaloriesInfo.activityLevel === 'sedentary') {
      activityFactor = 0.23;
    } else if (this.userCaloriesInfo.activityLevel === 'moderate') {
      activityFactor = 0.30;
    } else if (this.userCaloriesInfo.activityLevel === 'active') {
      activityFactor = 0.40;
    } else {
      activityFactor = 1.22;
    }

    let calorieMaintence: number;

    if (this.userCaloriesInfo.gender === 'female') {
      calorieMaintence = 88 + (10 * this.userCaloriesInfo.weight) + (6.25 * this.userCaloriesInfo.height) - (5 * this.userCaloriesInfo.age);
      calorieMaintence = calorieMaintence + (calorieMaintence * activityFactor);
      this.userCaloriesInfo.calorieMaintence = Math.trunc(calorieMaintence);

      if (this.userCaloriesInfo.objective == 'surplus') {
        this.userCaloriesInfo.target = Math.trunc(calorieMaintence + (calorieMaintence * this.userCaloriesInfo.percentage))
      }
      if (this.userCaloriesInfo.objective == 'deficit') {
        this.userCaloriesInfo.target =Math.trunc( calorieMaintence - (calorieMaintence * this.userCaloriesInfo.percentage))
      }
    }

    if (this.userCaloriesInfo.gender === 'male') {
      calorieMaintence = 288.362 + (13.397 * this.userCaloriesInfo.weight) + (4.799 * this.userCaloriesInfo.height) - (5.677 * this.userCaloriesInfo.age);
      calorieMaintence = calorieMaintence + (calorieMaintence * activityFactor);
      this.userCaloriesInfo.calorieMaintence = Math.trunc(calorieMaintence);

      if (this.userCaloriesInfo.objective == 'surplus') {
        this.userCaloriesInfo.target = Math.trunc(calorieMaintence + (calorieMaintence * this.userCaloriesInfo.percentage))
      }
      if (this.userCaloriesInfo.objective == 'deficit') {
        this.userCaloriesInfo.target = Math.trunc(calorieMaintence - (calorieMaintence * this.userCaloriesInfo.percentage))
      }
    }

    console.log(this.userCaloriesInfo);
    this.userCaloriesInfo.random = Math.floor(Math.random() * 4) + 1;

    // this.userCaloriesInfo = { ...this.userCaloriesInfo };
    this.dataService.createCalorieMaintence(this.userCaloriesInfo);
  }



}



