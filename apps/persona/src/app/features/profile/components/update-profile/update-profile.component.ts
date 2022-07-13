import {
	Component,
	ChangeDetectionStrategy,
	OnInit,
	ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import randomColor from 'randomcolor';
import { NavController } from '@ionic/angular';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-bottts-sprites';

import { IInterestAndBioAndCategory } from '@features/stories/data-access/state/stories.model';
import { IonicChips } from '@core/utils/ionic-chips';
import { UniqueUsername } from '@core/services/unique-username.service';
import { IUpdateProfile } from '@features/profile/interfaces/update-profile.interface';
import { ImageService } from '@core/services/image.service';

import { GetUser, UpdateProfile } from '../../data-access/state/profile.action';
import { IProfileStateModel } from '../../data-access/state/profile.model';
import { ProfileState } from '../../data-access/state/profile.state';

@Component({
	selector: 'persona-update-profile',
	templateUrl: './update-profile.component.html',
	styleUrls: ['./update-profile.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProfileComponent
	extends IonicChips<IInterestAndBioAndCategory>
	implements OnInit
{
	@Select(ProfileState.value)
	user$!: Observable<IProfileStateModel>;

	svg = createAvatar(style, {
		seed: 'custom-seed',
		base64: true,
		// ... and other options
	});

	profileCoverUrl$ = new BehaviorSubject<
		string | ArrayBuffer | null | undefined
	>(null);
	profilePictureUrl$ = new BehaviorSubject<
		string | ArrayBuffer | null | undefined
	>(null);
	isProfilePictureMimeTypeLegitimate = new BehaviorSubject(false);
	isProfileCoverMimeTypeLegitimate = new BehaviorSubject(false);
	color = '';

	profileForm: FormGroup = new FormGroup({
		profilePicture: new FormControl('', []),
		profileCover: new FormControl('', []),
		username: new FormControl(
			'',
			[Validators.pattern(/^[a-zA-Z0-9]*$/i)],
			[this.uniqueUsername.validate]
		),
		bio: new FormControl('', [Validators.maxLength(100)]),
		interests: new FormControl('', []),
		fullName: new FormControl('', [Validators.pattern(/^[a-zA-Z ,.'-]*$/i)]),
		sex: new FormControl('', []),
	});

	constructor(
		private readonly store: Store,
		private readonly uniqueUsername: UniqueUsername,
		private readonly activatedRoute: ActivatedRoute,
		private readonly imageService: ImageService,
		private readonly cdref: ChangeDetectorRef,
		private readonly navCtrl: NavController
	) {
		super();
	}

	ngOnInit() {
		this.store.dispatch(
			new GetUser(this.activatedRoute.snapshot.params['userId'])
		);

		this.subs.sink = this.user$.subscribe({
			next: (user) => {
				this.svg = createAvatar(style, {
					seed: user.fullName ?? 'custom-seed',
					base64: true,
					// ... and other options
				});

				if (user.id) {
					console.log(user);
					if (!this.chips.length)
						this.chips.push(
							...((user.interests as Array<IInterestAndBioAndCategory>) ?? [])
						);

					this.color = user.bio?.color ?? '#ff7f8e';

					this.profileForm.patchValue({
						username: user.username,
						sex: user.sex === 'other' ? '' : user.sex,
						fullName: user.fullName,
					});

					// this.imageService.getImage(value.profileCover)
				}
			},
		});
	}
	changeColor() {
		this.color = randomColor({
			luminosity: 'light',
			hue: 'random',
		});
	}

	goBack() {
		this.navCtrl.back({
			animated: true,
			animationDirection: 'back',
		});
	}

	profileCover(imageInput: HTMLInputElement): void {
		const readImage = this.imageService.read(imageInput);

		this.isProfileCoverMimeTypeLegitimate.next(readImage.valid);

		if (!readImage.valid) {
			// this.profileForm.setErrors({ valid: readImage.valid });
			return;
		}

		this.subs.sink = readImage.HtmlImage?.subscribe((data) => {
			this.profileCoverUrl$.next(data);
		});

		this.cdref.markForCheck();

		this.profileForm.controls['profileCover'].setValue(
			readImage.RawImage as File
		);
	}

	profilePicture(imageInput: HTMLInputElement): void {
		console.log(imageInput);
		const readImage = this.imageService.read(imageInput);

		this.isProfilePictureMimeTypeLegitimate.next(readImage.valid);

		console.log(readImage);

		this.subs.sink = readImage.HtmlImage?.subscribe((data) => {
			console.log(data);
			this.profilePictureUrl$.next(data);
		});

		if (!readImage.valid) {
			// this.profileForm.setErrors({ valid: readImage.valid });
			return;
		}

		this.cdref.markForCheck();

		this.profileForm.controls['profilePicture'].setValue(
			readImage.RawImage as File
		);
		console.log(this.profileForm.value);
	}

	async onSubmit() {
		if (this.profileForm.errors) {
			console.log(this.profileForm);
			return;
		}
		console.log(this.profileForm.value);
		for (const key in this.profileForm.value) {
			if (!this.profileForm.value[key]) delete this.profileForm.value[key];
		}
		console.log(this.profileForm.value);
		const updateProfile = {};

		Object.assign(updateProfile, this.profileForm.value);

		if (this.chips.length)
			Object.assign(updateProfile, { interests: this.chips });

		if (this.profileForm.value['bio'])
			Object.assign(updateProfile, {
				bio: {
					text: this.profileForm.value['bio'],
					color: this.color,
				},
			});

		console.log(updateProfile);

		if (Object.keys(updateProfile).length)
			this.store.dispatch(new UpdateProfile(updateProfile as IUpdateProfile));
	}
}
