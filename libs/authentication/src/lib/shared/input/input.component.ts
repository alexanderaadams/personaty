import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'lib-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
})
export class InputComponent {
	@Input() label!: string;
	@Input() autocomplete = 'on';
	@Input() control!: FormControl;
	@Input() inputType!: string;
	@Input() controlType = 'input';

	showErrors() {
		const { dirty, touched, errors } = this.control;
		return dirty && touched && errors;
	}
}
