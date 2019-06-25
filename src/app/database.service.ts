import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Image } from './gallery/gallery.component';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  /**
   * Base url for access to firebase firestore.
   */
  private baseUrlDB = 'paths';

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

    this.db.collection(this.baseUrlDB)
      .doc(newId)
      .set(newImage);
  }

  /**
   * Delete a specific image from firebase storage.
   */
  public deleteImage(imgPath: string): void {
    console.log(`${DatabaseService.name}::deleteImage`);
    this.db.collection(this.baseUrlDB).doc(imgPath).delete();
  }

  /**
   * Detect changes on database.
   */
  public getImagePaths$(): Observable<{}[]> {
    return this.db.collection(this.baseUrlDB).valueChanges();
  }
}
