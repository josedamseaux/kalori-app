import { Component, Injectable, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { userDietData } from '../share/interfaces/userDietData';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { DataService } from '../services/data.service';
// @Injectable({ providedIn: 'root' })
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

  tmbForUser: userDietData = {
    email: '',
    weight: 0,
    height: 0,
    age: 0,
    gender: '',
    tmb: 0,
    objective: '',
    percentage: 0,
    target: 0,
    random: 0
  }

  dataToCopy = {
    email: '',
    weight: 0,
    height: 0,
    age: 0,
    gender: '',
    tmb: 0,
    objective: '',
    percentage: 0,
    target: 0,
    random: 0
  }

  tmb = 0

  required: boolean = true

  ngOnInit() {
    this.subscription = this.dataService.getsubjectToOpenDietCreator()
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
    console.log('clicked presenttoat')
    let toast = await this.toastController.create({
      message: "field(s) cannot be empty",
      duration: 3000,
      position: "middle"
    });
    await toast.present();
  }

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
            this.thirdButtonForTrained()
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
        this.dataToCopy.weight = data.data.values.weight
        this.dataToCopy.height = data.data.values.height
        this.dataToCopy.age = data.data.values.age
        this.dataToCopy.tmb = (10 * data.data.values.weight) +
          (6.25 * data.data.values.height) -
          (5 * data.data.values.age) + 5
      })
  }

  async thirdButtonForTrained() {
    const alert2 = await this.alertController.create({
      // header: `Your Basal Metabolic Rate is ${this.tmbForUser.tmb}  ! What's your objective?`,
      header: `Select gender`,
      buttons: [
        {
          text: 'Male',
          role: 'male',
          handler: () => {
            this.dataToCopy.gender = 'male';
            this.fourthButtonForTrained()

          },
        },
        {
          text: 'Female',
          role: 'female',
          handler: () => {
            this.dataToCopy.gender = 'female';
            this.fourthButtonForTrained()
          },
        },
      ],
    });
    await alert2.present()
    await alert2.onDidDismiss();
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
            this.dataToCopy.objective = 'surplus';
          },
        },
        {
          text: 'caloric deficit (to lose weight)',
          role: 'deficit',
          handler: () => {
            this.dataToCopy.objective = 'deficit';
          },
        },
      ],
    });
    await alert2.present()
    await alert2.onDidDismiss();
    this.dataToCopy.random = Math.floor(Math.random() * 4) + 1;
    this.fifthButtonForTrained()
  }

  async fifthButtonForTrained() {
    const alert2 = await this.alertController.create({
      // header: `Your Basal Metabolic Rate is ${this.tmbForUser.tmb}  ! What's your objective?`,
      header: `How much would you like to go with the diet?`,
      subHeader: 'It is recommended going for a steady 10%',
      cssClass: 'select-percentage',
      buttons: [{
        text: 'OK', handler: async (data) => {
          this.dataToCopy.percentage = data
        },
      }],
      inputs: [
        {
          placeholder: '10%',
          type: 'radio',
          value: 0.1,
          label: '10%',
        },
        {
          name: '15',
          placeholder: '15%',
          type: 'radio',
          value: 0.15,
          label: '15%',
        },
        {
          name: '20',
          placeholder: '20%',
          type: 'radio',
          value: 0.20,
          label: '20%',
        },
      ],
    });
    await alert2.present()
    await alert2.onDidDismiss();
    let target;
    if(this.dataToCopy.objective == 'deficit'){
      target = (this.dataToCopy.tmb - (this.dataToCopy.tmb * this.dataToCopy.percentage)).toFixed(0);
    } else {
      target = (this.dataToCopy.tmb * this.dataToCopy.percentage + this.dataToCopy.tmb).toFixed(0);
    }
    this.dataToCopy.target = parseInt(target)
    
    console.log(this.dataToCopy.tmb)
    console.log(this.dataToCopy.percentage)

    this.tmbForUser = {...this.dataToCopy}
    console.log(this.dataToCopy)
    console.log(this.tmbForUser)
    this.dataService.createTMB(this.tmbForUser)
  }

}
