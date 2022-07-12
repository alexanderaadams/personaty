import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchFormComponent } from './switch-form.component';

describe('SwitchFormComponent', () => {
  let component: SwitchFormComponent;
  let fixture: ComponentFixture<SwitchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ SwitchFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
