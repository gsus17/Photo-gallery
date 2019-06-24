import { Component, OnInit, OnDestroy } from '@angular/core';
import { UploadService } from '../app-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatabaseService } from '../database.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogEnterNameComponent } from './dialog-enter-name/dialog-enter-name.component';
import { difference } from 'lodash';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

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
    private appServiceService: UploadService,
    private databaseService: DatabaseService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {

    this.isLoading = false;
    this.imageList = [];
    this.getImagesFromDataBase();
  }

  ngOnInit() {
  }

  /**
   * Unsubscribe.
   */
  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Take a picture process.
   */
  public takePicture() {
    console.log(`${HomeComponent.name}::takePicture`);
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
          destinationType: destinationType.DATA_URL
        });
    });

    promise
      .then((imageData: string) => {
        this.openDialog()
          .then(() => {
            this.postPicture(imageData, this.name);
          })
          .catch(() => {
            this.isLoading = false;
          });
      })
      .catch((message) => {
        console.log(`${HomeComponent.name}::onFail message %o`, message);
        this.isLoading = false;
      });
  }

  /**
   * Upload the imaga to firebase.
   */
  private postPicture(imageData: string, pictureName: string) {
    console.log(`${HomeComponent.name}::postPicture`);

    this.appServiceService.$upload(imageData)
      .toPromise()
      .then((response) => {
        console.log(`${HomeComponent.name}::then %o`, response);
        this.openSnackBar('Success', null);

        this.printUrl(response);
        this.saveImgPath(response, pictureName);
      })
      .catch((error) => {
        console.log(`${HomeComponent.name}::catch %o`, error);
        this.openSnackBar('Error', null);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  /**
   * Show the url download.
   */
  private printUrl(success) {
    success.ref.getDownloadURL()
      .then((s) => {
        console.log(`${HomeComponent.name}::then %o`, s);
      });
  }

  /**
   * Save the img path in database.
   */
  private saveImgPath(success, pictureName: string) {
    success.ref.getDownloadURL()
      .then((path: string) => {
        this.databaseService.saveImgPath(path, pictureName);
        this.name = null;
      });
  }

  /**
   * Listen changes on database for render imgs.
   */
  private getImagesFromDataBase() {
    this.subscription = this.databaseService.getImagePaths$()
      .subscribe((data: any[]) => {
        console.log(`${HomeComponent.name}::getImagesFromDataBase data %o`, data);
        if (data.length > 0) {

          if (this.imageList.length === 0) {
            data.forEach((img: any) => {
              const imageToRender: Image = {
                id: img.id,
                name: img.name,
                src: img.src
              };

              this.imageList.push(imageToRender);
            });
          } else {
            // const newImage: any[] = difference(data, this.imageList);
            this.imageList = data;
            // this.imageList = [...this.imageList, ...newImage];
          }
        }
      });
  }

  /**
   * Show the message sucess or fail.
   */
  private openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 50,
    });
  }

  /**
   * Open the dialog to apply for the image name.
   */
  private openDialog(): Promise<any> {
    console.log(`${HomeComponent.name}::openDialog`);

    const promise = new Promise((resolve, reject) => {
      const dialogRef = this.dialog.open(DialogEnterNameComponent, {
        data: { name: this.name }
      });

      dialogRef.afterClosed()
        .subscribe(result => {
          console.log('The dialog was closed');
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
}

export interface Image {
  id: number;
  name: string;
  src: string;
}
