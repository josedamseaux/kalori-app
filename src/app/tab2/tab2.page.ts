import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { userDietData } from '../share/interfaces/userDietData';
import { AlertController } from '@ionic/angular';
import { UserInformation } from '../interfaces/interface';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private dataService: DataService, private alertController: AlertController) { }

  userInfo!: UserInformation;
  showNoDataMessage: boolean = true
  target: any;
  groupedByMonth: any
  groupedByMonthCopy: any;

  objectivesByDay: any;
  objectivesByDayCopy: any;

  ngOnInit() {
    this.updateDietObjective()
    setTimeout(() => {
      this.fetchTMBData()
      console.log("Retrasado por 1 segundo.");
    }, 0);
    this.getMeals()

    this.dataService.isNewDataPresent$.subscribe(resp => {
      console.log(resp)
    })
  }

  getMeals() {
    this.dataService.isNewDataPresent$.subscribe(resp => {
      // este codigo evita que se refresque demasiado las consultas
      //basicamente no hace nueva solicitud a BD a menos que sea primer inicio de app o haya nueva data
      if (resp == 'beginningOfApp' || resp == 'newData') {
        this.dataService.getMealsTransformed().subscribe(resp => {
          console.log(resp)

          this.objectivesByDay = resp
          this.objectivesByDayCopy = resp
          this.groupedByMonth = resp
          this.groupedByMonthCopy = resp
          this.dataService.isNewDataPresent.next('1')
        })
      }
      if (resp == '1') {
        this.groupedByMonth = this.groupedByMonthCopy
        this.objectivesByDay = this.objectivesByDayCopy
      }
    })
  }

  updateDietObjective() {
    this.dataService.subjectToCreateDiet$.subscribe(async data => {
      if (data) {
        this.userInfo = data;
        this.showNoDataMessage = false;
      } else {
        this.showNoDataMessage = true;
      }
    });
  }

  fetchTMBData(): void {
    this.dataService.TMBSubject$.subscribe(data => {
      if (data) {
        console.log(data)
        this.userInfo = data;
        this.showNoDataMessage = false;
      } else {
        this.showNoDataMessage = true;
      }
    });
  }

  createNewDietObjective() {
    this.dataService.subjectToOpenDietCreator.next('create diet!')
  }

  getStyleForEachDay(kcalTotal: any) {
    let kcaltarget = 0;
    this.dataService.TMBSubject$.subscribe(data => {
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
      // 'background-color': color,
      'color': color
    }
  }

  getBackgroundStyleForEachDay(kcalTotal: any) {
    let kcaltarget = 0;
    this.dataService.TMBSubject$.subscribe(data => {
      if (data) {
        kcaltarget = data.target;
        this.target = data.target
      }
    });

    let kcal = kcalTotal - kcaltarget
    console.log(kcalTotal)
    let color = '#ffd781'
    if (kcal >= -90 && kcal <= 90) {
      color = '#e7ffde' // light-green: good -/+80
    } else if (kcal >= -200 && kcal <= -100) {
      color = '#ffedc5' // light-yellow: -/+100
    } else if (kcal >= -299 && kcal <= -200) {
      color = '#ffe09c' // strong-yellow: -/+ 300
    } else if (kcal <= -300 || kcal >= 300) {
      color = '#ffa852' // strong-orange: -/+ 400
    } else {
      color = 'rgb(255, 208, 161)' // light-yellow: -/+100
    }
    return {
      'background-color': color
    }
  }

 async deleteEntry(entry: any) {
    const alert2 = await this.alertController.create({
      header: 'Are you sure to delete?',
      buttons: [
        {
          text: 'No',
          role: 'no',
          handler: () => {
            alert2.dismiss()
          },
        },
        {
          text: 'Ok',
          role: 'ok',
          handler: () => {
            this.dataService.delete(entry)
          },
        }
      ],
    });
    await alert2.present();
  }

}
