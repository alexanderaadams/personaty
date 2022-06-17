import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, MomentDateModule } from '@angular/material-moment-adapter';

import { MY_DATE_FORMATS } from '@persona/shared';

@NgModule({
	imports: [
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatDividerModule,
		MatInputModule,
		MatDatepickerModule,
		MomentDateModule,		MatNativeDateModule
	],
	exports: [
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatDividerModule,
		MatInputModule,
		MatDatepickerModule,
		MatMomentDateModule,		MatNativeDateModule
	],
	providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class LoginMaterialModule {}
