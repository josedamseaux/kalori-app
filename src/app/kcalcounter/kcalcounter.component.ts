import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Subscription } from 'rxjs';
import { format } from 'date-fns';

@Component({
  selector: 'app-kcalcounter',
  templateUrl: './kcalcounter.component.html',
  styleUrls: ['./kcalcounter.component.scss'],
})
export class KcalcounterComponent implements OnInit {

  constructor(private dataService: DataService) { }

 formattedDate = format(new Date(), 'MMM dd, yyyy');

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
    let gradientTop = 'transparent'; // Color de fondo para la parte superior del degradado
    let gradientBottom = 'transparent'; // Color de fondo para la parte inferior del degradado

    if (kcal >= -99 && kcal <= 100) {
      color = '#ceffba'; // light-green: good -/+80
    } else if (kcal >= -200 && kcal <= -100) {
      color = '#ffd781'; // light-yellow: -/+100
    } else if (kcal >= -299 && kcal <= -200) {
      color = '#ffbb29'; // strong-yellow: -/+ 300
    } else if (kcal <= -300) {
      color = '#ff8000'; // strong-orange: -/+ 400
      gradientTop = '#ffffff'; // Color blanco para la parte superior del degradado
      gradientBottom = 'rgba(255, 255, 255, 0)'; // Color transparente para la parte inferior del degradado
    }

    // Devolver un color de fondo con degradado desde la parte superior hasta la inferior
    return {
      'background': `linear-gradient(to bottom, ${gradientTop}, ${color}, ${gradientBottom})`
    };
  }

  calculateKcalTotal() {
    this.kcalSoFarSubscription = this.dataService.subjectKcalSoFar$.subscribe(resp => {
      if (resp) {
        console.log(resp)
        this.kcalTotal = resp
        this.kcalVsTMB = this.kcalTarget - this.kcalTotal
        console.log(this.kcalTarget)
        console.log(this.kcalTotal)

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
