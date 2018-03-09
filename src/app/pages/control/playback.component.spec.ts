import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FuePlaybackComponent } from './playback.component';

describe('FuePlaybackComponent', () => {
  let component: FuePlaybackComponent;
  let fixture: ComponentFixture<FuePlaybackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FuePlaybackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FuePlaybackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
