import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule, } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AppComponent } from './app.component';
import { UploadService } from './app-service.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material/angular.material.module';
import { GalleryComponent } from './gallery/gallery.component';
import { DatabaseService } from './database.service';
import { AngularFirestoreModule, FirestoreSettingsToken } from '@angular/fire/firestore';
import { DialogEnterNameComponent } from './gallery/dialog-enter-name/dialog-enter-name.component';
import { DialogImageDetailComponent } from './gallery/dialog-image-detail/dialog-image-detail.component';

// Firebase configuration.
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
    GalleryComponent,
    DialogEnterNameComponent,
    DialogImageDetailComponent
  ],
  entryComponents: [
    DialogEnterNameComponent,
    DialogImageDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularMaterialModule
  ],
  providers: [UploadService, DatabaseService, { provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
