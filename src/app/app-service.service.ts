import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { base64StringToBlob } from 'blob-util';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private storage: AngularFireStorage) {

  }

  /**
   * Upload process.
   */
  public $upload(file: string): Observable<firebase.storage.UploadTaskSnapshot> {
    console.log(`${UploadService.name}::upload %o`, file);

    const id = Math.random().toString(36).substring(2);
    const filePath = `uploads/${id}`;
    const blob = this.mapDataURItoBlob(file);
    const task = this.storage.upload(filePath, blob);

    return task.snapshotChanges();
  }

  /**
   * Convert base64 to blod.
   */
  public mapDataURItoBlob(b64Data): Blob {
    console.log(`${UploadService.name}::dataURItoBlob b64Data %o `, b64Data);

    const contentType = 'image/png';
    const blob = base64StringToBlob(b64Data, contentType);
    return blob;
  }
}
