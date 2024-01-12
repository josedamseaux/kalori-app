import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { userDietData } from '../share/interfaces/userDietData';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private dataService: DataService) { }

  userInfo!: userDietData;
  showNoDataMessage: boolean = true
  target: any;
  
  private getMealSubscription: Subscription | undefined;
  private tmbSubscription: Subscription | undefined;


  groupedByMonth: any;



  ngOnInit() {
    this.fetchTMBData()
    this.updateDietObjective()
    setTimeout(() => {
      this.fetchTMBData()
      console.log("Retrasado por 1 segundo.");
    }, 0);
    this.getMeals()

  }

  getMeals() {
    this.getMealSubscription = this.dataService.getMeals().subscribe(resp => {
     this.groupedByMonth = resp
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
      console.log(data);
      if (data) {
        this.userInfo = data;
        this.showNoDataMessage = false;
      } else {
        this.showNoDataMessage = true;
      }
    });
  }

  createNewDietObjective(){
    this.dataService.subjectToOpenDietCreator.next('create diet!')
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

}