import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormService } from '@auth/core/data-access/services/form.service';
import { AuthState } from '@auth/core/data-access/state/auth.state';
import { FormModule } from '@auth/pages/form/form.module';
import { NgxsModule } from '@ngxs/store';
import { AngularMaterialModule } from '@persona/shared';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { LogoutComponent } from './logout.component';

describe('LogoutComponent', () => {
	let component: LogoutComponent;
	let fixture: ComponentFixture<LogoutComponent>;
	let formService: FormService;

	beforeAll(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [LogoutComponent],
			imports: [
				HttpClientTestingModule,
				RouterTestingModule,
				ApolloTestingModule,
				NgxsModule.forRoot([AuthState]),
				AngularMaterialModule,
				FormModule,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(LogoutComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();

		// formService = TestBed.inject(FormService);

		// jest.spyOn(formService, 'followAuthenticationStatus').mockReturnValue(true);
		// jest.spyOn(formService, 'goAuthenticate').mockImplementation(() => true);
		jest.spyOn(component, 'ngOnInit').mockImplementation();
	}));

	it('should create', waitForAsync(() => {
		expect(component).toBeTruthy();
	}));
	it('should call ngOnInit ', waitForAsync(() => {
		component.ngOnInit();
		expect(component.ngOnInit).toHaveBeenCalled();
	}));
});
