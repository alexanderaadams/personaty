import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
	selector: 'lib-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
})
export class InputComponent {
	hide = false;

	@Input() formInput!: string;
	@Input() name!: string;
	@Input() label!: string;
	@Input() spellcheck!: string;
	@Input() placeholder = '';
	@Input() type!: string;
	@Input() control!: FormControl;
	@Input() min!: string;
	@Input() max!: string;
	@Input() submit!: AbstractControl;
	@Input() autocomplete!: string;

	showErrors() {
		const { dirty, touched } = this.control;
		return dirty && touched;
	}
}
