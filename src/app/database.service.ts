import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private db: AngularFirestore) { }

  /**
   * Generate an id.
   */
  public createId(): string {
    return this.db.createId();
  }

  /**
   * Save the img path on data base.
   */
  public saveImgPath(imgPath: string): void {
    console.log(`${DatabaseService.name}::saveImgPath`);

    const newId = this.createId();

    const newImage = {
      src: imgPath
    };

    this.db.collection('paths')
      .doc(newId)
      .set(newImage);
  }

  /**
   * Detect changes on database.
   */
  public getImagePaths$(): Observable<{}[]> {
    return this.db.collection('paths').valueChanges();
  }
}
