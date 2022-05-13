import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularMaterialModule } from './angular-material.module';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		HttpClientModule,
		AngularMaterialModule,
	],
	exports: [
		CommonModule,
		AngularMaterialModule,
		ReactiveFormsModule,
		HttpClientModule,
	],
})
export class CoreModule {}
