import { Component, OnInit, OnDestroy } from '@angular/core';
import { UploadService } from '../app-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatabaseService } from '../database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  public isLoading: boolean;
  public imageList: Image[];
  public subscription: Subscription = null;

  constructor(
    private appServiceService: UploadService,
    private databaseService: DatabaseService,
    private snackBar: MatSnackBar) {
    this.isLoading = false;
    this.imageList = [];
    this.getImagesFromDataBase();
  }

  ngOnInit() {
  }

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
        this.postPicture(imageData);
      })
      .catch((message) => {
        console.log(`${HomeComponent.name}::onFail message %o`, message);
        this.isLoading = false;
      });
  }

  /**
   * Upload the imaga to firebase.
   */
  private postPicture(imageData: string) {
    console.log(`${HomeComponent.name}::postPicture`);

    this.appServiceService.$upload(imageData)
      .toPromise()
      .then((response) => {
        console.log(`${HomeComponent.name}::then %o`, response);
        this.openSnackBar('Success', null);

        this.printUrl(response);
        this.saveImgPath(response);
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
  private saveImgPath(success) {
    success.ref.getDownloadURL()
      .then((path: string) => {
        this.databaseService.saveImgPath(path);
      });
  }

  /**
   * Listen changes on database for render imgs.
   */
  private getImagesFromDataBase() {
    this.subscription = this.databaseService.getImagePaths$()
      .subscribe((data) => {
        console.log(`${HomeComponent.name}::getImagesFromDataBase data %o`, data);
        if (data.length > 0) {
          this.imageList = [];

          data.forEach((img: any) => {
            const imageToRender: Image = {
              name: '',
              src: img.src
            };

            this.imageList.push(imageToRender);
          });
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
}

export interface Image {
  name: string;
  src: string;
}
