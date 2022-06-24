import { Injectable } from '@angular/core';
import { tap, take } from 'rxjs/operators';
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

		interests: null,

		email: null,

		fullName: null,

		username: null,

		createdAt: null,

		stories: null,
	},
})
@Injectable()
export class ProfileState {
	@Selector()
	static profile(profile: IProfileStateModel) {
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
		if (action.payload === 'profile')
			return this.localStorageService
				.getItem(action.payload as 'profile')
				.pipe(
					tap((cache) => {
						ctx.patchState(cache);
					}),
					take(1)
				)
				.subscribe();

		return this.profileService
			.updateProfile(action.payload as IUpdateProfile)
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
}
