import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FueDrawingComponent } from './drawing.component';

describe('FueDrawingComponent', () => {
  let component: FueDrawingComponent;
  let fixture: ComponentFixture<FueDrawingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FueDrawingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FueDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
