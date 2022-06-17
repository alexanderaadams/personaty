import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from '@persona/shared';

@NgModule({
	imports: [
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatDividerModule,

		MatDatepickerModule,
		MatNativeDateModule,

		MatInputModule,
		MatDatepickerModule,
		MomentDateModule,
	],
	exports: [
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatDividerModule,

		MatDatepickerModule,
		MatNativeDateModule,

		MatInputModule,
		MatDatepickerModule,
		MomentDateModule,
	],
	providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class SignupMaterialModule {}
