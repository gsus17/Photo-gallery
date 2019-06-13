import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule, } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AppComponent } from './app.component';
import { AppServiceService } from './app-service.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material/angular.material.module';
import { HomeComponent } from './home/home.component';

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAxaak2fyxzXea9JvzaZGd7_wrtXbyrVag',
  authDomain: 'upload-img-research.firebaseapp.com',
  databaseURL: 'https://upload-img-research.firebaseio.com',
  projectId: 'upload-img-research',
  storageBucket: 'upload-img-research.appspot.com',
  messagingSenderId: '488579339694',
  appId: '1:488579339694:web:a22bb85fc0fcc4a7'
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularMaterialModule
  ],
  providers: [AppServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
