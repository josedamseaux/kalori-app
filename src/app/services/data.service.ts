import { Injectable, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, doc, getDoc, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject, from, map, shareReplay, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { CollectionReference, DocumentData, deleteDoc, documentId, getDocs, limit, orderBy } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private subjectToCreateDiet = new BehaviorSubject<any>(null);
  subjectToCreateDiet$ = this.subjectToCreateDiet.asObservable();

  subjectToOpenDietCreator = new BehaviorSubject<any>(null);
  subjectToOpenDietCreator$ = this.subjectToOpenDietCreator.asObservable();

  isNewDataPresent = new BehaviorSubject<any>(null);
  isNewDataPresent$ = this.isNewDataPresent.asObservable();

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

  getMealsTransformed(): Observable<any[]> {
    return from(this.authService.getCurrentUser()).pipe(
      switchMap((user) => {
        const uid = user.uid;
        const dataCollection: CollectionReference<DocumentData> = collection(this.firestore, uid);
        const queryForMeals = query(dataCollection, orderBy("createdAt", "desc"), limit(15));

        return collectionData(queryForMeals).pipe(
          map((resp: any[]) => {
            console.log(resp)

            const groupedData: any = {};
            // Iterar sobre los objetos originales
            resp.forEach(obj => {
              // console.log(obj)
              // Obtener la propiedad 'dateAdded' del objeto
              const dateAdded = obj['dateAdded'];

              // Verificar si ya hay un grupo con esta fecha
              if (groupedData[dateAdded]) {
                // Si ya existe, agregar los alimentos al grupo existente
                groupedData[dateAdded].foods.push(...obj['foods']);
              } else {
                // Si no existe, crear un nuevo grupo con esta fecha
                groupedData[dateAdded] = { ...obj };
                // Inicializar el total de kcal en 0
                groupedData[dateAdded].kcalTotal = 0;
              }

              // Calcular la suma total de kcal para los alimentos en el grupo
              const totalKcal = obj['foods'].reduce((total: any, food: { kcal: any; }) => total + food.kcal, 0);

              // Agregar el total de kcal al objeto agrupado
              groupedData[dateAdded].kcalTotal += totalKcal;
            });
            let aver:any = Object.values(groupedData)
            console.log(aver[0].kcalTotal)
            this.subjectKcalSoFar.next(aver[0].kcalTotal)
            // this.subjectKcalSoFar.next(groupedData[0].kcalTotal)
            // Obtener los valores del objeto groupedData para obtener el arreglo agrupado
            return Object.values(groupedData);
          })
        );
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

  async delete(data: any) {
    const dataCollection: CollectionReference<DocumentData> = collection(this.firestore, this.uid);
    const queryForMeals = query(dataCollection, orderBy("createdAt", "desc"));

    try {
      const querySnapshot = await getDocs(queryForMeals);

      const docIdsToDelete: string[] = [];

      querySnapshot.forEach(doc => {
        const docData = doc.data();
        if (docData['dateAdded'] === data.dateAdded) {
          console.log(docData);
          docIdsToDelete.push(doc.id); // Almacenar el ID del documento a eliminar
        }
      });

      // Eliminar todos los documentos almacenados en docIdsToDelete
      docIdsToDelete.map(async docId => {
        const documentRef = doc(this.firestore, `${this.uid}/${docId}`);
        await deleteDoc(documentRef);
      });

      console.log("Documentos eliminados correctamente:", docIdsToDelete);
    } catch (error) {
      console.error("Error al obtener o eliminar documentos:", error);
    }
  }

}
