import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: Auth) { }


  getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  }

  async register({email, password}: { email: string, password: string }){
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password)
     return user
    } 
    catch (e) {
      return null
    }
  }

  async login({email, password}: { email: string, password: string }){
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password)
      return user
    } 
    catch (e) {
      return null
    }
  }

  logout(){
    return signOut(this.auth)
  }

}
