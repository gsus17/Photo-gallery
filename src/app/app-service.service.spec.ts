import { TestBed } from '@angular/core/testing';

import { UploadService } from './app-service.service';

describe('AppServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadService = TestBed.get(UploadService);
    expect(service).toBeTruthy();
  });
});
