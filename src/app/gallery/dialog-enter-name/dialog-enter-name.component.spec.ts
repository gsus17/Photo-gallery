import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEnterNameComponent } from './dialog-enter-name.component';

describe('DialogEnterNameComponent', () => {
  let component: DialogEnterNameComponent;
  let fixture: ComponentFixture<DialogEnterNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEnterNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEnterNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
