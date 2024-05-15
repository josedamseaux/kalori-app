import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { serverTimestamp } from 'firebase/firestore';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor(private alertController: AlertController,
    private dataService: DataService) {
  }

  target: number | undefined;
  private getMealSubscription: Subscription | undefined;
  private tmbSubscription: Subscription | undefined;

  meal: any = {
    foods: []
  }

  groupedByMonth: any;
  objective: string = ''

  ngOnInit() {
    this.getMeals()
    this.getObjective()


  }

  getObjective(){
    this.dataService.TMBSubject$.subscribe(data=>{
        this.objective = data!.objective
        console.log(data!.objective)
    })
  }

  getMeals() {
    this.dataService.getMealsTransformed().subscribe(resp => {
      this.groupedByMonth = resp
      console.log(this.groupedByMonth)
      this.dataService.isNewDataPresent$.subscribe(resp => {
        console.log(resp)
        if (resp == null) {
          this.dataService.isNewDataPresent.next('beginningOfApp')
        }
      })
    })
  }

  async addMeal() {
    const alert = await this.alertController.create({
      header: 'Add meal',
      buttons: [{
        text: 'Add another', handler: async (data) => {
          console.log(data.meal)
          let meal = this.convertFirstLetterToCapital(data.meal);
          let kcal = parseInt(data.kcal);
          let object = {
            meal,
            kcal
          };

          if (data.meal.length === 0) {
            await this.errorEnteringMealName();
            await alert.present();
            return; // Detener la ejecución del resto del código si el valor de meal esta vacio
          }

          if (isNaN(kcal) || data.kcal == '') {
            await this.errorEnteringKcal();
            await alert.present();
            return; // Detener la ejecución del resto del código si el valor de kcal no es un número
          }
          this.meal.foods.push(object);
          this.addMeal();
        },
      },
      {
        text: 'Done', handler: async (data) => {
          if (data.meal.length === 0) {
            await this.errorEnteringMealName();
            await alert.present();
            return; // Detener la ejecución del resto del código si el valor de meal esta vacio
          }
          if (isNaN(data.kcal) || data.kcal == '') {
            await this.errorEnteringKcal();
            await alert.present();
            return; // Detener la ejecución del resto del código si el valor de kcal no es un número
          } else {

            let meal = this.convertFirstLetterToCapital(data.meal);
            let kcal = parseInt(data.kcal);
            let object = {
              meal,
              kcal,
            };

            this.meal.foods.push(object);
            let timeStamp = serverTimestamp();
            let dateAdded = new Date(); // Obtiene la fecha actual
            let dia = dateAdded.getDate();
            let mes = dateAdded.getMonth() + 1;
            let anio = dateAdded.getFullYear();
            let date = `${dia < 10 ? '0' : ''}${dia}-${mes < 10 ? '0' : ''}${mes}-${anio}`;
            Object.assign(this.meal, { dateAdded: date });
            Object.assign(this.meal, { createdAt: timeStamp });
            Object.assign(this.meal, { objective: this.objective });

            this.dataService.addMeal(this.meal);
            this.meal.foods = [];
            this.dataService.isNewDataPresent.next('newData');
            this.getMeals();
          }
        },
      }],
      inputs: [
        {
          name: 'meal',
          placeholder: 'E.g., eggs, broccoli, bread',
          type: 'text',
        },
        {
          name: 'kcal',
          placeholder: 'Calories',
          type: 'number',
        }
      ],
    });

    await alert.present();
  }

  async errorEnteringMealName() {
    const alert2 = await this.alertController.create({
      header: 'Please enter meal name',
      buttons: [
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {
            this.addMeal();
          },
        }
      ],
    });
    await alert2.present();
  }

  async errorEnteringKcal() {
    const alert2 = await this.alertController.create({
      header: 'Please enter a valid number',
      buttons: [
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {
            this.addMeal();
          },
        }
      ],
    });
    await alert2.present();
  }

  getStyleForEachDay(kcalTotal: any) {
    let kcaltarget = 0;
    this.tmbSubscription = this.dataService.TMBSubject$.subscribe(data => {
      if (data) {
        kcaltarget = data.target;
        this.target = data.target
      }
    });

    let kcal = kcalTotal - kcaltarget
    let color = '#ffd781'
    if (kcal >= -99 && kcal <= 100) {
      color = '#90d473' // light-green: good -/+80
    } else if (kcal >= -200 && kcal <= -100) {
      color = '#ffd781' // light-yellow: -/+100
    } else if (kcal >= -299 && kcal <= -200) {
      color = '#ffbb29' // strong-yellow: -/+ 300
    } else if (kcal <= -300 || kcal >= 300) {
      color = '#ff8000' // strong-orange: -/+ 400
    } else {
      color = '#ffd781' // light-yellow: -/+100
    }
    return {
      'color': color
    }
  }

  getStyleForEachDay2(kcalTotal: any) {
    let kcaltarget = 0;
    this.tmbSubscription = this.dataService.TMBSubject$.subscribe(data => {
      if (data) {
        kcaltarget = data.target;
        this.target = data.target
      }
    });
    let kcal = kcalTotal - kcaltarget
    let color = '#ffd781'
    if (kcal >= -99 && kcal <= 100) {
      color = '#90d473' // light-green: good -/+80
    } else if (kcal >= -200 && kcal <= -100) {
      color = '#ffd781' // light-yellow: -/+100
    } else if (kcal >= -299 && kcal <= -200) {
      color = '#ffbb29' // strong-yellow: -/+ 300
    } else if (kcal <= -300 || kcal >= 300) {
      color = '#ff8000' // strong-orange: -/+ 400
    } else {
      color = '#ffd781' // light-yellow: -/+100
    }
    return {
      'color': color
    }
  }

  convertFirstLetterToCapital(lower: string) {
    lower = lower.toLowerCase();
    lower = lower.charAt(0).toUpperCase() + lower.substring(1);
    console.log(lower);
    return lower;
  }

  ngOnDestroy() {
    this.tmbSubscription!.unsubscribe();
    this.getMealSubscription!.unsubscribe();
  }


}

