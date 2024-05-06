import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-kcalcounter',
  templateUrl: './kcalcounter.component.html',
  styleUrls: ['./kcalcounter.component.scss'],
})
export class KcalcounterComponent implements OnInit {

  constructor(private dataService: DataService) { }

  kcalTarget: number = 0;
  kcalTotal: number = 0;
  kcalVsTMB: number = 0;
  kcalPassed: string = '';
  messageForStatusOfTarget = ''
  today: number = Date.now();

  private tmbSubscription: Subscription | undefined;
  private kcalSoFarSubscription: Subscription | undefined;


  ngOnInit() {
    this.getKcalTarget()
    this.getStyle()
    this.calculateKcalTotal()
  }

  getKcalTarget() {
    this.tmbSubscription = this.dataService.TMBSubject$.subscribe(data => {
      if (data) {
        console.log(data);
        this.kcalTarget = data.target;
      }
    });
  }

  getStyle() {
    let color = '#ffd781'; // Color predeterminado
    let kcal = this.kcalVsTMB;
    if (this.kcalVsTMB != 0) {
      if (kcal >= -99 && kcal <= 100) {
        color = '#dcffcd'; // light-green: good -/+80
      } else if (kcal >= -200 && kcal <= -100) {
        color = '#ffd781'; // light-yellow: -/+100
      } else if (kcal >= -299 && kcal <= -200) {
        color = '#ffbb29'; // strong-yellow: -/+ 300
      } else if (kcal <= -300) {
        console.log('entro')
        color = '#ff8000'; // strong-orange: -/+ 400
      }
    }
    return {
      'background': color
    };
  }

  calculateKcalTotal() {
    this.kcalSoFarSubscription = this.dataService.subjectKcalSoFar$.subscribe(resp => {
      console.log(resp)
      if (resp) {
        this.kcalTotal = resp
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
      }
    })
  }

  ngOnDestroy() {
    this.tmbSubscription!.unsubscribe();
    this.kcalSoFarSubscription!.unsubscribe();
  }



}
