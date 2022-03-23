import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { InputComponent } from './input/input.component';
import { EmailTokenComponent } from './email-token/email-token.component';
import { DatePickerComponent } from './date-picker/date-picker.component';

@NgModule({
	declarations: [InputComponent, EmailTokenComponent, DatePickerComponent],
	imports: [CommonModule, ReactiveFormsModule],
	exports: [InputComponent, EmailTokenComponent, DatePickerComponent],
})
export class SharedModule {}
