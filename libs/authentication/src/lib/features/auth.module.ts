import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from '@persona/shared';
// import { FormComponent } from '@auth/pages/form/form.component';

import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		AuthRoutingModule,
		AngularMaterialModule,
	],
})
export class AuthModule {
	//
}
