import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '@persona/authentication';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule,
		HttpClientModule,
		AngularMaterialModule,
	],
	exports: [
		CommonModule,
		ReactiveFormsModule,
		RouterModule,
		HttpClientModule,
		AngularMaterialModule,
	],
})
export class CoreModule {}
