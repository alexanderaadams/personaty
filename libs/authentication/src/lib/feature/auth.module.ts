import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule } from './auth-routing.module';
import { AngularMaterialModule } from '../shared/angular-material.module';
import { InputComponent } from '../shared/ui/input/input.component';

@NgModule({
	declarations: [InputComponent],
	imports: [
		CommonModule,
		AngularMaterialModule,
		AuthRoutingModule,
		ReactiveFormsModule,
		FormsModule,
	],
})
export class AuthModule {
	//
}
