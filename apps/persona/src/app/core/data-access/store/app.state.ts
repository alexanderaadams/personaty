import { Injectable } from '@angular/core';
import { Action, State, StateContext } from '@ngxs/store';

import { UnsubscribeOnDestroyAdapter } from '@persona/shared';
import { GetCsrfToken } from './app.action';
import { CsrfTokenModel } from './app.model';
import { AppService } from '../../../app.service';

@State<CsrfTokenModel>({
	name: 'app',
	defaults: {
		status: null,
	},
})
@Injectable()
export class AppState extends UnsubscribeOnDestroyAdapter {
	constructor(private appService: AppService) {
		super();
	}

	@Action(GetCsrfToken)
	getUserInfo(ctx: StateContext<CsrfTokenModel>, _action: GetCsrfToken) {
		this.subs.sink = this.appService.getCsrfToken().subscribe({
			next: (res: any) => {
				ctx.patchState(res as CsrfTokenModel);
			},
			error: () => {
				ctx.patchState({
					status: false,
				});
			},
		});
	}
}
