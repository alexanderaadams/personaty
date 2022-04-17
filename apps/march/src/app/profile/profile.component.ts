import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Select, Store, Actions } from '@ngxs/store';
import { GetUserInfo } from './store/profile.action';
import { UnsubscribeOnDestroyAdapter } from '@march/authentication';
import { ProfileState } from './store/profile.state';
import { Observable } from 'rxjs';
import { ProfileStateModel } from './store/profile.model';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { CreateStory } from '../story/store/story.action';
@Component({
	selector: 'march-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnInit
{
	storyForm = new FormGroup({
		title: new FormControl('', [Validators.required]),

		description: new FormControl('', [Validators.required]),

		category: new FormControl([''], [Validators.required]),
	});

	@Select(ProfileState.userInfo)
	user$!: Observable<ProfileStateModel>;

	id = this.activatedRoute.snapshot.params['id'];
	addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	categories: string[] = [];

	constructor(
		private store: Store,
		private activatedRoute: ActivatedRoute,
		private actions$: Actions
	) {
		super();
	}

	ngOnInit(): void {
		this.store.dispatch(new GetUserInfo(this.id));
	}

	add(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();

		// Add our fruit
		if (value) {
			this.categories.push(value);
			this.storyForm.controls['category'].setValue(this.categories);
		}

		// Clear the input value
		event.chipInput?.clear();
	}

	remove(category: string): void {
		const index = this.categories.indexOf(category);

		if (index >= 0) {
			this.categories.splice(index, 1);
		}
	}

	onSubmit() {
		// const id = this.activatedRoute.snapshot.params['id'];
		console.log({ ...this.storyForm.value, user_id: this.id });
		if (this.storyForm?.invalid || !this.storyForm.value) {
			return this.storyForm.setErrors({ invalid: true });
		}

		this.store.dispatch(
			new CreateStory({ ...this.storyForm.value, user_id: this.id })
		);

		// this.subs.sink = this.store.dispatch(new Signup(this.authForm.value)).subscribe({
		// 	next: () => {
		// 		this.subs.sink = this.isAuthenticated$
		// 			.pipe(
		// 				tap((authenticated) => {
		// 					if (!authenticated) this.authForm.setErrors({ invalid: true });
		// 				})
		// 			)
		// 			.subscribe();
		// 	},
		// 	error: () => {
		// 		this.authForm.setErrors({ invalid: true });
		// 	},
		// });
	}
}
