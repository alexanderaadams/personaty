import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { Action, State, StateContext, Selector } from '@ngxs/store';

import { GetUser, UpdateProfile } from './profile.action';
import { ProfileService } from '../services/profile.service';
import { IProfileStateModel } from './profile.model';
import { IUpdateProfile } from '../../interfaces/update-profile.interface';
import { LocalStorageService } from '@persona/shared';

@State<IProfileStateModel>({
	name: 'profile',

	defaults: {
		id: null,

		profilePicture: null,

		profileCover: null,

		birthDate: null,

		bio: null,

		locale: null,

		interests: null,

		email: null,

		fullName: null,

		username: null,

		createdAt: null,

		sex: null,
	},
})
@Injectable()
export class ProfileState {
	@Selector()
	static value(profile: IProfileStateModel) {
		return profile;
	}

	constructor(
		private profileService: ProfileService,
		private localStorageService: LocalStorageService
	) {}

	@Action(GetUser)
	getUser(ctx: StateContext<IProfileStateModel>, action: GetUser) {
		this.profileService
			.getUser(action.payload)
			.pipe(take(1))
			.subscribe({
				next: (res: IProfileStateModel) => {
					ctx.patchState(res);
					// this.updateMyStorageEngineService('auth', res);
				},
				error: () => {
					// ctx.setState();
				},
			});
	}

	@Action(UpdateProfile)
	updateProfile(ctx: StateContext<IProfileStateModel>, action: UpdateProfile) {
		return this.profileService
			.updateProfile(action.payload as IUpdateProfile)
			.pipe(take(1))
			.subscribe({
				next: (res: any) => {
					ctx.patchState(res);
				},
				error: () => {
					// ctx.
				},
			});
	}
}
