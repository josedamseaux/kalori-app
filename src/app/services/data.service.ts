import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private subjectToCreateDiet = new BehaviorSubject<any>(null);

  constructor() { }

  callSubjectToCreateDiet(data: any) {
    this.subjectToCreateDiet.next(data);
  }

  getSubjectToCreateDiet() {
    return this.subjectToCreateDiet.asObservable();
  }

}

