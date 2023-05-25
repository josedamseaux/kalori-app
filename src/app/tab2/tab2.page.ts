import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { userDietData } from '../share/interfaces/userDietData';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private dataService: DataService) { }

  userInfo!: userDietData;
  showNoDataMessage: boolean = true

  ngOnInit() {
    this.fetchTMBData()
    this.updateDietObjective()
    setTimeout(() => {
      this.fetchTMBData()
      console.log("Retrasado por 1 segundo.");
    }, 0);
  }

  updateDietObjective() {
    this.dataService.getCreateDietSubject().subscribe(async data => {
      if (data) {
        this.userInfo = data;
        this.showNoDataMessage = false;
      } else {
        this.showNoDataMessage = true;
      }

    });
  }

  fetchTMBData(): void {
    this.dataService.getTMBSubject().subscribe(data => {
      console.log(data);
      if (data) {
        this.userInfo = data;
        this.showNoDataMessage = false;
      } else {
        this.showNoDataMessage = true;
      }
    });
  }



}