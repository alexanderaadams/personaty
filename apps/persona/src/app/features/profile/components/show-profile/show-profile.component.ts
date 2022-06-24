import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Store, Actions } from '@ngxs/store';
import { BehaviorSubject, Observable } from 'rxjs';

import { FormService } from '@persona/authentication';
import { UnsubscribeOnDestroyAdapter, environment } from '@persona/shared';

import { ProfileService } from '../../data-access/services/profile.service';
import { GetUser } from '../../data-access/state/profile.action';
import { IProfileStateModel } from '../../data-access/state/profile.model';

@Component({
	selector: 'persona-profile',
	templateUrl: './show-profile.component.html',
	styleUrls: ['./show-profile.component.scss'],
})
export class ShowProfileComponent
	extends UnsubscribeOnDestroyAdapter
	implements OnInit
{
	backendUrl: string = environment.BACKEND_URL;
	createStory = new BehaviorSubject(false);

	user$!: Observable<IProfileStateModel>;

	id = this.activatedRoute.snapshot.params['id'];

	constructor(
		private store: Store,
		private activatedRoute: ActivatedRoute,
		private actions$: Actions,
		private profileService: ProfileService,
		private router: Router,
		private formService: FormService
	) {
		super();
	}

	ngOnInit(): void {
		this.store.dispatch(new GetUser(this.id));
	}

	onCreateStory() {
		this.router.navigate(['story', this.id]);
		// this.createStory.next(true);
	}

	onCancelStory() {
		// this.createStory.next(false);
	}
}
