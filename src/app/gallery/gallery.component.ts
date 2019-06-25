import { Component, OnInit, OnDestroy } from '@angular/core';
import { UploadService } from '../app-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatabaseService } from '../database.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogEnterNameComponent } from './dialog-enter-name/dialog-enter-name.component';
import { DialogImageDetailComponent } from './dialog-image-detail/dialog-image-detail.component';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, OnDestroy {

  /**
   * Evaluate the loading state.
   */
  public isLoading: boolean;

  /**
   * Image list to render.
   */
  public imageList: Image[];

  /**
   * Name of captured image.
   */
  public name: string;

  /**
   * Subscription to firebase database.
   */
  public subscription: Subscription = null;

  constructor(
    private uploadService: UploadService,
    private databaseService: DatabaseService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
  }

  /**
   * Init component.
   */
  public ngOnInit() {
    this.isLoading = true;
    this.imageList = [];
    this.getImagesFromDataBase();
  }

  /**
   * Unsubscribe.
   */
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * showDetails
   */
  public showDetails(image: Image) {
    console.log(`${GalleryComponent.name}::showDetails`);
    this.openImageDetailsDialog(image);
  }

  /**
   * Take a picture process.
   */
  public takePicture() {
    const methodName = `${GalleryComponent.name}::takePicture`;
    console.log(`${methodName}`);

    this.isLoading = true;

    const nav: any = navigator;
    const destinationType: any = nav.camera.DestinationType;

    // Se usa una promesa ya que se pierde el scope y no actualiza el dom angular.
    const promise = new Promise((resolve, reject) => {
      // Take picture using device camera and retrieve image as base64-encoded string
      nav.camera.getPicture(
        (imageData) => {
          resolve(imageData);
        },
        (message) => {
          reject(message);
        }, {
          quality: 50,
          allowEdit: false,
          destinationType: destinationType.DATA_URL,
          correctOrientation: true,
          saveToPhotoAlbum: true
        });
    });

    promise
      .then((imageData: string) => {
        this.openImageNameDialog()
          .then(() => {
            console.log(`${methodName}::getPicture (then)`);
            this.postPicture(imageData, this.name);
          })
          .catch(() => {
            console.log(`${methodName}::getPicture (catch)`);
            this.isLoading = false;
          });
      })
      .catch((message) => {
        console.log(`${GalleryComponent.name}::onFail message %o`, message);
        this.isLoading = false;
      });
  }

  /**
   * Upload the imaga to firebase.
   */
  private postPicture(imageData: string, pictureName: string) {
    const methodName = `${GalleryComponent.name}::postPicture`;
    console.log(`${methodName}`);

    this.uploadService.$upload(imageData)
      .toPromise()
      .then((response) => {
        console.log(`${methodName} (then) response %o`, response);
        this.openSnackBar('Success', null);
        this.saveImgPath(response, pictureName);
      })
      .catch((error) => {
        console.log(`${methodName} (catch) error %o`, error);
        this.openSnackBar('Error', null);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  /**
   * Save the img path in database.
   */
  private saveImgPath(success, pictureName: string) {
    const methodName = `${GalleryComponent.name}::saveImgPath`;
    console.log(`${methodName}`);

    success.ref.getDownloadURL()
      .then((path: string) => {
        this.databaseService.saveImgPath(success, path, pictureName);
        this.name = null;
      });
  }

  /**
   * Listen changes on database for render imgs.
   */
  private getImagesFromDataBase() {
    const methodName = `${GalleryComponent.name}::getImagesFromDataBase`;
    console.log(`${methodName}`);

    this.subscription = this.databaseService.getImagePaths$()
      .subscribe((data: any[]) => {
        console.log(`${methodName}::subscription data %o`, data);

        if (data.length > 0) {

          if (this.imageList.length === 0) {
            data.forEach((img: any) => {
              const imageToRender: Image = {
                id: img.id,
                name: img.name,
                src: img.src,
                size: img.size,
                contentType: img.contentType,
                fullPath: img.fullPath,
                timeCreated: img.timeCreated
              };

              this.imageList.push(imageToRender);
            });
          } else {
            this.imageList = data;
          }
        } else {
          this.imageList = data;
        }

        this.isLoading = false;
      });
  }

  /**
   * Show the message sucess or fail.
   */
  private openSnackBar(message: string, action: string) {
    console.log(`${GalleryComponent.name}::openSnackBar`);

    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  /**
   * Delete a specific image.
   */
  private deleteImage(image: Image) {
    console.log(`${GalleryComponent.name}::deleteImage`);

    this.deleteImageFromFirebaseDatabase(image.id);
    this.deleteImageFromFirebaseStorage(image.fullPath);

    this.openSnackBar('Deleted', null);
  }

  /**
   * Delete a specific image from firebase storage.
   */
  private deleteImageFromFirebaseStorage(path: string) {
    console.log(`${GalleryComponent.name}::deleteImageFromFirebaseStorage path %o`, path);
    this.uploadService.deleteImage(path);
  }

  /**
   * Delete a specific image from firebase database.
   */
  private deleteImageFromFirebaseDatabase(id: string) {
    console.log(`${GalleryComponent.name}::deleteImageFromFirebaseDatabase id %o`, id);
    this.databaseService.deleteImage(id);
  }

  /**
   * Open the dialog to apply for the image name.
   */
  private openImageNameDialog(): Promise<any> {
    const methodName = `${GalleryComponent.name}::openImageNameDialog`;
    console.log(`${methodName}`);

    const promise = new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(DialogEnterNameComponent, {
        data: { name: this.name }
      });

      dialogRef.afterClosed()
        .subscribe(result => {
          console.log(`${methodName}::The dialog was closed`);
          this.name = result;

          if (this.name !== null && this.name !== undefined) {
            resolve();
          } else {
            reject();
          }
        });
    });

    return promise;
  }

  /**
   * Open the dialog to show the image detail.
   */
  private openImageDetailsDialog(image: Image): Promise<any> {
    const methodName = `${GalleryComponent.name}::openImageDetailsDialog`;
    console.log(`${methodName}`);

    const promise = new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(DialogImageDetailComponent, {
        data: image
      });

      dialogRef.afterClosed()
        .subscribe(result => {
          console.log(`${methodName}::The dialog was closed`);
          this.deleteImage(result);
          resolve();
        });
    });

    return promise;
  }
}

export interface Image {
  id: string;
  name: string;
  src: string;
  size: number;
  contentType: string;
  fullPath: string;
  timeCreated: Date;
}
