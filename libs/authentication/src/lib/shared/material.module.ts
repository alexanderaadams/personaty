import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MY_DATE_FORMATS } from './my-date-formats';
import { Oauth2SuccessComponent } from '../oauth2-success/oauth2-success.component';


@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatDividerModule,
		MatAutocompleteModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatChipsModule,
		MatInputModule,
		MatDatepickerModule,
		MomentDateModule,
		MatSnackBarModule,MatProgressBarModule
	],
	exports: [
		MatButtonModule,
		MatFormFieldModule,
		MatIconModule,
		MatDividerModule,
		MatAutocompleteModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatChipsModule,
		MatInputModule,
		MatDatepickerModule,
		MomentDateModule,
		MatSnackBarModule,MatProgressBarModule
	],
	providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
	declarations: [
   Oauth2SuccessComponent
	],
})
export class MaterialModule {}
