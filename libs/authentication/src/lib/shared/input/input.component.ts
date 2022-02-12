import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'lib-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss'],
})
export class InputComponent {
	@Input() name!: string;
	@Input() spellcheck!: string;
	@Input() placeholder = '';
	@Input() required = 'required';
	@Input() autocomplete = 'off';
	@Input() type!: string;
	@Input() control!: FormControl;
	@Input() controlType = 'input';
}
