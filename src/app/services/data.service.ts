import { Injectable, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject, from, map, shareReplay, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { CollectionReference, DocumentData, limit, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private subjectToCreateDiet = new BehaviorSubject<any>(null);
  subjectToCreateDiet$ = this.subjectToCreateDiet.asObservable();

  subjectToOpenDietCreator = new BehaviorSubject<any>(null);
  subjectToOpenDietCreator$ = this.subjectToOpenDietCreator.asObservable();

  private subjectTMB = new BehaviorSubject<any>(null);
  TMBSubject$ = this.subjectTMB.asObservable();

  private subjectKcalSoFar = new BehaviorSubject<any>(null);
  subjectKcalSoFar$ = this.subjectKcalSoFar.asObservable()

  private uid!: string;

  constructor(private firestore: Firestore, private authService: AuthService) {
    this.authService.getCurrentUser().then((user) => {
      this.uid = user.uid;
    });

    this.getTMB().subscribe(data => {
      this.subjectTMB.next(data);
    });

  }

  async createCalorieMaintence(data: any) {
    const mealDocRef = doc(this.firestore, `${this.uid}/tmb`);
    const mealDocSnapshot = await getDoc(mealDocRef);

    if (mealDocSnapshot.exists()) {
      const existingData = mealDocSnapshot.data();
      const newData = { ...existingData, ...data };
      await updateDoc(mealDocRef, newData);
    } else {
      await setDoc(mealDocRef, data);
    }
    this.subjectToCreateDiet.next(data)
    this.subjectTMB.next(data)
  }

  getTMB(): Observable<any> {
    return from(this.authService.getCurrentUser()).pipe(
      switchMap(user => {
        const documentRef = doc(this.firestore, `${user.uid}/tmb`);
        return from(getDoc(documentRef));
      }),
      map(documentSnapshot => {
        return documentSnapshot.data();
      }),
      shareReplay(1)
    );
  }

  async addMeal(data: any) {
    let randomId = Math.floor(Math.random() * 100) + 1;
    const mealDocRef = doc(this.firestore, `${this.uid}/meal${randomId}`);
    setDoc(mealDocRef, data);
  }

  getMeal() {
    return from(this.authService.getCurrentUser()).pipe(
      switchMap((user) => {
        const uid = user.uid;
        const dataCollection: CollectionReference<DocumentData> = collection(this.firestore, uid);
        const queryForMeals = query(dataCollection, orderBy("createdAt", "desc"), limit(25));
        return collectionData(queryForMeals);
      })
    );
  }

  getMostRecentMeal() {
    return from(this.authService.getCurrentUser()).pipe(
      switchMap((user) => {
        const uid = user.uid;
        const dataCollection: CollectionReference<DocumentData> = collection(this.firestore, uid);
        const queryForMeals = query(dataCollection, orderBy("createdAt", "desc"), limit(1));
        return collectionData(queryForMeals);
      })
    );
  }

  getMeals() {
    return this.getMeal().pipe(
      map(resp => {
        let data = resp.filter((objeto: any) => objeto.foods && objeto.createdAt && objeto.dateAdded);
        const groupedByDate: any = {};

        data.forEach((obj: any) => {
          const date = obj.dateAdded;
          if (!groupedByDate[date]) {
            groupedByDate[date] = [];
          }
          groupedByDate[date].push(obj);
        });

        console.log(groupedByDate);

        for (const date in groupedByDate) {
          if (groupedByDate.hasOwnProperty(date)) {
            const array = groupedByDate[date];
            let kcalTotal = 0;
            for (const obj of array) {
              for (const food of obj.foods) {
                kcalTotal += food.kcal;
              }
            }
            array.push({ kcalTotal }); // Agregar el objeto kcalTotal al arreglo existente
            groupedByDate[date] = array; // Actualizar el valor para la fecha en el objeto agrupado
          }
        }
        const filteredByMonth = this.filterEntriesByMonth(groupedByDate);

        const dateToday = format(new Date(), 'dd-MM-yyyy');
        let matchingDate = null;

        for (const month in filteredByMonth) {
          if (filteredByMonth.hasOwnProperty(month)) {
            const monthData = filteredByMonth[month];
            for (const date in monthData) {
              if (date === dateToday) {
                matchingDate = date;
                const matchingObjects = filteredByMonth[month][matchingDate];
                matchingObjects.forEach((resp: any)=>{
                  this.subjectKcalSoFar.next(resp.kcalTotal)
                })
                break;
              }
            }
            if (matchingDate) {
              break;
            }
          }
        }
        return filteredByMonth;
      })
    );
  }

  filterEntriesByMonth(data: any) {
    const filteredData: any = {};
    for (const date in data) {
      const month = date.split('-')[1];
      if (!filteredData[month]) {
        filteredData[month] = {};
      }
      filteredData[month][date] = data[date];
    }

    return filteredData;
  }

}
