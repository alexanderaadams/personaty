import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';

import { AuthState } from '@persona/authentication';
import { Observable } from 'rxjs';

@Component({
	selector: 'persona-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
	@Select(AuthState.userId)
	userId$!: Observable<string>;

	constructor(private readonly router: Router, private readonly store: Store) {}
}
