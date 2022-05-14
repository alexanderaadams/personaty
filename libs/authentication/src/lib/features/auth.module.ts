import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { AngularMaterialModule } from '@persona/shared';

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
