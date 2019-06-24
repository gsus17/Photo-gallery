import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Image } from './home/home.component';

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
  public saveImgPath(success: any, imgPath: string, pictureName: string): void {
    console.log(`${DatabaseService.name}::saveImgPath success %o`, success);

    const newId = this.createId();

    const newImage: Image = {
      id: newId,
      name: pictureName,
      src: imgPath,
      size: success.metadata.size,
      contentType: success.metadata.contentType,
      fullPath: success.metadata.fullPath,
      timeCreated: success.metadata.timeCreated
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
