import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogImageDetailComponent } from './dialog-image-detail.component';

describe('DialogImageDetailComponent', () => {
  let component: DialogImageDetailComponent;
  let fixture: ComponentFixture<DialogImageDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogImageDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogImageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
