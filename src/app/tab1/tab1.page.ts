import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { serverTimestamp } from 'firebase/firestore';
import { ChangeDetectorRef } from '@angular/core';
import { compareAsc, isToday } from 'date-fns';
import { isSameDay, parse, getDay, getMonth, getYear } from 'date-fns';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  constructor(private alertController: AlertController,
    private dataService: DataService,
    private ChangeDetectorRef: ChangeDetectorRef) {
  }

  meal: any = {
    foods: []
  }

  data: any = [];

  groupedByDate: any

  kcalTarget: number = 0;
  kcalTotal: number = 0;
  kcalVsTMB: number | undefined;
  kcalPassed: string = '';
  messageForStatusOfTarget = ''

  ngOnInit() {
    this.getMeals()
    this.getKcalTarget()
    this.getStyle()
  }

  getKcalTarget() {
    this.dataService.getTMBSubject().subscribe(data => {
      if (data) {
        console.log(data);
        this.kcalTarget = data.target;
      }
    });
  }

  getMeals() {
    this.dataService.getMeal().subscribe(resp => {
      this.data = resp.filter((objeto: any) => objeto.foods && objeto.createdAt && objeto.dateAdded);
      const sortedArray = this.data.sort((a:any, b:any) => compareAsc(parse(a.dateAdded, 'dd-MM-yyyy', new Date()), parse(b.dateAdded, 'dd-MM-yyyy', new Date())));
      const groupedByDate = sortedArray.reduce((result: any, obj: any) => {
        const date = obj.dateAdded;
        if (!result.has(date)) {
          result.set(date, []);
        }
        result.get(date).push(obj);
        return result;
      }, new Map());

      this.groupedByDate = groupedByDate
      console.log(groupedByDate);

      for (const [date, array] of groupedByDate.entries()) {
        let kcalTotal = 0;
        for (const obj of array) {
          for (const food of obj.foods) {
            kcalTotal += food.kcal;
          }
        }
        array.push({ kcalTotal }); // Agregar el objeto kcalTotal al arreglo existente
        groupedByDate.set(date, array); // Actualizar el valor para la fecha en el objeto agrupado
      }

      this.calculateKcalTotal();
      this.ChangeDetectorRef.detectChanges();
    });
  }

  async addMeal() {
    const alert = await this.alertController.create({
      header: 'Add meal',
      buttons: [{
        text: 'Add another', handler: async (data) => {
          let meal = this.convertFirstLetterToCapital(data.meal)
          let kcal = parseInt(data.kcal)
          let object = {
            meal,
            kcal
          }
          this.meal.foods.push(object);
          this.addMeal();
        },
      },
      {
        text: 'Done', handler: async (data) => {
          let meal = this.convertFirstLetterToCapital(data.meal)
          let kcal = parseInt(data.kcal)
          let object = {
            meal,
            kcal
          }
          this.meal.foods.push(object);
          let timeStamp = serverTimestamp()
          let dateAdded = new Date(); // Obtiene la fecha actual
          let dia = dateAdded.getDate();
          let mes = dateAdded.getMonth() + 1;
          let anio = dateAdded.getFullYear();
          let date = `${dia < 10 ? '0' : ''}${dia}-${mes < 10 ? '0' : ''}${mes}-${anio}`;
          Object.assign(this.meal, { dateAdded: date });
          Object.assign(this.meal, { createdAt: timeStamp });
          this.dataService.addMeal(this.meal)
          this.meal.foods = []
          this.getMeals();
        },
      },
    ],
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

    await alert.present()
    await alert.onDidDismiss()
  }

  getStyle() {
    let kcal: any = this.kcalVsTMB;
    let color = '#ffd781'
    if (kcal >= -99 && kcal <= 100) {
      color = '#dcffcd' // light-green: good -/+80
    } else if (kcal >= -200 && kcal <= -100) {
      color = '#ffd781' // light-yellow: -/+100
    } else if (kcal >= -299 && kcal <= -200) {
      color = '#ffbb29' // strong-yellow: -/+ 300
    } else if (kcal >= -Infinity && kcal <= -300) {
      color = '#ff8000' // strong-orange: -/+ 400
    } else {
      color = '#ffd781' // light-yellow: -/+100
    }

    return {
      'background': color
    };
  }
 
  getStyleForEachDay(kcalTotal: any) {

    console.log(kcalTotal)
    let kcal = kcalTotal - this.kcalTarget
    let color = '#ffd781'

    if (kcal >= -99 && kcal <= 100) {
      color = '#90d473' // light-green: good -/+80
    } else if (kcal >= -200 && kcal <= -100) {
      color = '#ffd781' // light-yellow: -/+100
    } else if (kcal >= -299 && kcal <= -200) {
      color = '#ffbb29' // strong-yellow: -/+ 300
    } else if (kcal >= -Infinity && kcal <= -300) {
      color = '#ff8000' // strong-orange: -/+ 400
    } else {
      color = '#ffd781' // light-yellow: -/+100
    }
    return {
      'color': color
    }
  }

  calculateKcalTotal() {
    this.kcalTotal = 0;

    let filteredArray = this.data.filter((obj: any) => {
      let [day, month, year] = obj.dateAdded.split('-');
      let dayInt = parseInt(day)
      let monthInt = parseInt(month)
      let yearInt = parseInt(year)
      let dataToSeeIfToday = new Date(yearInt, monthInt - 1, dayInt);

      return isToday(dataToSeeIfToday);

    });

    console.log(filteredArray)

    filteredArray.forEach((resp: any) => {
      console.log(resp)
      resp.foods.forEach((resp2: any) => {
        this.kcalTotal += resp2.kcal;
        this.kcalVsTMB = this.kcalTarget - this.kcalTotal
        if (this.kcalVsTMB == 0) {
          this.messageForStatusOfTarget = `Perfectly balanced, as all things should be.`;
        } else if (this.kcalVsTMB < this.kcalTarget) {
          this.messageForStatusOfTarget = `${this.kcalVsTMB} to go`;
        }
        if (this.kcalTotal > this.kcalTarget) {
          this.kcalPassed = this.kcalVsTMB.toString()
          this.messageForStatusOfTarget = `${this.kcalPassed.replace("-", "+")} passed`
        }
      });
    });
  }

  convertFirstLetterToCapital(lower: string) {
    lower = lower.toLowerCase();
    lower = lower.charAt(0).toUpperCase() + lower.substring(1);
    console.log(lower);
    return lower;
  }

}

