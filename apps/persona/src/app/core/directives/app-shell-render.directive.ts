import {
	Directive,
	OnInit,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';
import { SharedService } from '@persona/shared';

@Directive({
	selector: '[personaAppShellRender]',
})
export class AppShellRenderDirective implements OnInit {
	constructor(
		private sharedService: SharedService,
		private templateRef: TemplateRef<any>,
		private viewContainerRef: ViewContainerRef
	) {}

	ngOnInit(): void {
		if (this.sharedService.isServer.value) {
			this.viewContainerRef.createEmbeddedView(this.templateRef);
		} else {
			// setTimeout(() => {
			this.viewContainerRef.clear();
			// }, 1000);
		}
	}
}
