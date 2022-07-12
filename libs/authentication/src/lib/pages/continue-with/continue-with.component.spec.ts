import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContinueWithComponent } from './continue-with.component';

describe('ContinueWithComponent', () => {
  let component: ContinueWithComponent;
  let fixture: ComponentFixture<ContinueWithComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContinueWithComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContinueWithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
