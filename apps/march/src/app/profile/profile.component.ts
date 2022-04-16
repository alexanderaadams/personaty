import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Select, Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { GetUserInfo } from './store/profile.action';
import { UnsubscribeOnDestroyAdapter } from '@march/authentication';
import { ProfileState } from './store/profile.state';
import { Observable, tap } from 'rxjs';
import { ProfileStateModel } from './store/profile.model';

@Component({
	selector: 'march-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css'],
})
export class ProfileComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnInit
{
	@Select(ProfileState.userInfo)
	user$!: Observable<ProfileStateModel>;

	id = this.activatedRoute.snapshot.params['id'];

	constructor(
		private store: Store,
		private activatedRoute: ActivatedRoute,
		private actions$: Actions
	) {
		super();
	}

	ngOnInit(): void {
		// console.log(this.id);

		// this.user$
		// 	.pipe(
		// 		tap((res) => {
		// 			console.log(res);
		// 		})
		// 	)
		// 	.subscribe();

		// this.actions$.pipe(ofActionSuccessful(GetUserInfo)).subscribe({
		// 	next: (res) => {
		// 		console.log(res);
		// 	},
		// });

		this.store.dispatch(new GetUserInfo(this.id));
	}
}
