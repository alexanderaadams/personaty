import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'lib-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
})
export class InputComponent {
	@Input() name!: string;
	@Input() label!: string;
	@Input() placeholder!: string;
	@Input() type!: string;
	@Input() formControl!: FormControl;
	@Input() min!: string;
	@Input() max!: string;
	@Input() autocomplete!: string;

	hide = false;

	showErrors() {
		const { dirty, touched } = this.formControl;
		return dirty && touched;
	}
}
