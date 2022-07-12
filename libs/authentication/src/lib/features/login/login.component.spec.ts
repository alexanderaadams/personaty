import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { LoginComponent } from './login.component';
import { AuthState } from '../../core/data-access/state/auth.state';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AngularMaterialModule } from '@persona/shared';
import { FormModule } from '../../pages/form/form.module';
import { FormService } from '@auth/core/data-access/services/form.service';
import { of } from 'rxjs';
import {
	LoginWithGoogle,
	ResetAuthStoreToDefault,
} from '../../core/data-access/state/auth.action';

describe('LoginComponent', () => {
	let fixture: ComponentFixture<LoginComponent>;
	let component: LoginComponent;
	let store: Store;
	let formService: FormService;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [LoginComponent],
			imports: [
				HttpClientTestingModule,
				RouterTestingModule,
				ApolloTestingModule,
				NgxsModule.forRoot([AuthState]),
				AngularMaterialModule,
				FormModule,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(LoginComponent);

		store = TestBed.inject(Store);
		formService = TestBed.inject(FormService);

		component = fixture.componentInstance;

		jest.spyOn(store, 'dispatch').mockImplementation(() => of(true));
		jest.spyOn(component, 'loginWithGoogle');
		jest.spyOn(formService, 'goAuthenticate').mockImplementation();
	}));

	it('should check the existence of the login component', waitForAsync(() => {
		expect(component).toBeTruthy();
	}));

	it('should check if isAuthenticated$ does exist', waitForAsync(() => {
		expect(component.isAuthenticated$).toBeTruthy();
	}));

	it('should check if form email, password fields are submitted', waitForAsync(() => {
		component.authForm.setValue({
			email: 'test@example.com',
			password: '11',
		});

		component.onSubmit();

		formService.goAuthenticate(new ResetAuthStoreToDefault());
		expect(formService.goAuthenticate).toHaveBeenCalled();
	}));
	it('should check if form login with google with has been dispatched', waitForAsync(() => {
		store.dispatch(new LoginWithGoogle());
		expect(store.dispatch).toHaveBeenCalled();
	}));
});
