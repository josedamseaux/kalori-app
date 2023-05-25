import { Injectable, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, getDoc, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from, map, shareReplay, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { CollectionReference, DocumentData } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  subjectToCreateDiet = new BehaviorSubject<any>(null);

  subjectToOpenDietCreator = new BehaviorSubject<any>(null);

  private TMBSubject = new BehaviorSubject<any>(null);

  private uid!: string;

  constructor(private firestore: Firestore, private authService: AuthService) {
    this.authService.getCurrentUser().then((user) => {
      this.uid = user.uid;
    });

    this.getTMB().subscribe(data => {
      this.TMBSubject.next(data);
    });
  }

  getCreateDietSubject() {
    return this.subjectToCreateDiet.asObservable();
  }

  getsubjectToOpenDietCreator() {
    return this.subjectToOpenDietCreator.asObservable();
  }

  getTMBSubject() {
    return this.TMBSubject.asObservable();
  }

  async createTMB(data: any) {
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
    this.TMBSubject.next(data)
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
        const queryForMeals = query(dataCollection);
        return collectionData(queryForMeals);
      })
    );
  }


}
