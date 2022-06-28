import {
	Component,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { BehaviorSubject } from 'rxjs';

import { IInterestAndBioAndCategory } from '@features/story/data-access/state/story.model';
import { MaterialChips } from '@core/utils/material-chips';
import { CheckImageService } from '@core/services/check-image.service';
import { UniqueUsername } from '@core/services/unique-username.service';
import { UpdateProfile } from '../../data-access/state/profile.action';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IUpdateProfile } from '@features/profile/interfaces/update-profile.interface';
import { SharedService } from '@persona/shared';

@Component({
	selector: 'persona-update-profile',
	templateUrl: './update-profile.component.html',
	styleUrls: ['./update-profile.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProfileComponent extends MaterialChips<IInterestAndBioAndCategory> {
	profileCoverUrl!: string | ArrayBuffer | null | undefined;
	profilePictureUrl!: string | ArrayBuffer | null | undefined;
	selectedSex = new BehaviorSubject<'female' | 'male' | null>(null);
	isProfilePictureMimeTypeLegitimate = new BehaviorSubject(false);
	isProfileCoverMimeTypeLegitimate = new BehaviorSubject(false);
	color = '#000f20';

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
		// private maximumInterests: MaximumInterests,
		private readonly store: Store,
		private readonly checkImageService: CheckImageService,
		private uniqueUsername: UniqueUsername,
		private readonly cdref: ChangeDetectorRef,
		private _snackBar: MatSnackBar,
		private readonly sharedService: SharedService
	) {
		super();
	}

	get executingLoader$() {
		return this.sharedService.executingLoader$;
	}

	profileCoverSelected(imageInput: any): void {
		if (imageInput.files && imageInput.files[0]) {
			const reader = new FileReader();

			reader.readAsDataURL(imageInput.files[0]); // Read file as data url
			reader.onloadend = (e) => {
				// function call once readAsDataUrl is completed
				this.profileCoverUrl = e?.target?.['result']; // Set image in element
				this.cdref.markForCheck(); // Is called because ChangeDetection is set to onPush
			};

			this.isProfileCoverMimeTypeLegitimate.next(
				this.checkImageService.isImageMimeTypeValid(imageInput)
			);

			if (!this.isProfileCoverMimeTypeLegitimate.value) {
				this._snackBar.open('Please Upload Correct Cover Photo', '', {
					verticalPosition: 'top',
					duration: 3000,
					panelClass: 'snack-bar-danger',
				});
				this.profileForm.setErrors({ valid: false });
				return;
			}

			this.profileForm.controls['profileCover'].setValue(
				imageInput.files[0] as File
			);
		}
	}

	profilePictureSelected(imageInput: any): void {
		if (imageInput.files && imageInput.files[0]) {
			const reader = new FileReader();

			reader.readAsDataURL(imageInput.files[0]); // Read file as data url
			reader.onloadend = (e) => {
				// function call once readAsDataUrl is completed
				this.profilePictureUrl = e?.target?.['result']; // Set image in element
				this.cdref.markForCheck(); // Is called because ChangeDetection is set to onPush
			};

			this.isProfilePictureMimeTypeLegitimate.next(
				this.checkImageService.isImageMimeTypeValid(imageInput)
			);

			if (!this.isProfilePictureMimeTypeLegitimate.value) {
				this._snackBar.open('Please Upload Correct Profile Photo', '', {
					verticalPosition: 'top',
					duration: 3000,
					panelClass: 'snack-bar-danger',
				});
				this.profileForm.setErrors({ valid: false });
				return;
			}

			this.profileForm.controls['profilePicture'].setValue(
				imageInput.files[0] as File
			);
			console.log(this.profileForm.value);
		}
	}

	onSubmit() {
		if (this.profileForm.errors) {
			console.log(this.profileForm);
			this.profileForm.valid;
			return;
		}

		for (const key in this.profileForm.value) {
			if (this.profileForm.value[key] === '')
				delete this.profileForm.value[key];
		}

		const updateProfile = {};

		Object.assign(updateProfile, this.profileForm.value);

		if (this.chips.length)
			Object.assign(updateProfile, { interests: this.chips });

		// if (this.chips.length > 10) {
		// 	this.profileForm.controls['interests'].setErrors({ valid: false });
		// 	return;
		// }

		if (this.profileForm.controls['bio'].value)
			Object.assign(updateProfile, {
				bio: {
					text: this.profileForm.controls['bio'],
					color: this.color,
				},
			});

		console.log(
			'updateProfile',
			updateProfile,
			'profileForm',
			this.profileForm.value
		);

		console.log(Object.keys(updateProfile).length);
		if (Object.keys(updateProfile).length)
			this.store.dispatch(new UpdateProfile(updateProfile as IUpdateProfile));
	}
}
