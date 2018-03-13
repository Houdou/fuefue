import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FueBpmComponent } from './bpm.component';

describe('FueBpmComponent', () => {
  let component: FueBpmComponent;
  let fixture: ComponentFixture<FueBpmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FueBpmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FueBpmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
