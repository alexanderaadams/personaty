import {
	Component,
	OnInit,
	ElementRef,
	Output,
	EventEmitter,
} from '@angular/core';

@Component({
	selector: 'lib-modal',
	templateUrl: './modal.component.html',
	styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
	@Output() dismiss = new EventEmitter();

	constructor(private el: ElementRef) {}

	ngOnInit() {
		document.body.appendChild(this.el.nativeElement);
	}

	ngOnDestroy() {
		this.el.nativeElement.remove();
	}

	onDismissClick() {
		this.dismiss.emit();
	}
}
