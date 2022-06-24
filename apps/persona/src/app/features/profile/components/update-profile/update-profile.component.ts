import {
	Component,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { BehaviorSubject, Subject } from 'rxjs';

import { IInterestAndBioAndCategory } from '@features/story/data-access/state/story.model';
import { UpdateMaterialChip } from '@core/utils/update-material-chip';
import { CheckImageService } from '@core/services/check-image.service';
import { UniqueUsername } from '@core/services/unique-username.service';
import { UpdateProfile } from '../../data-access/state/profile.action';
import { IUpdateProfile } from '../../interfaces/update-profile.interface';

@Component({
	selector: 'persona-update-profile',
	templateUrl: './update-profile.component.html',
	styleUrls: ['./update-profile.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProfileComponent extends UpdateMaterialChip<IInterestAndBioAndCategory> {
	profileCoverUrl!: string | ArrayBuffer | null | undefined;
	profilePictureUrl!: string | ArrayBuffer | null | undefined;
	sex = new BehaviorSubject<'female' | 'male' | null>(null);
	isProfilePictureMimeTypeLegitimate = new BehaviorSubject(true);
	isProfileCoverMimeTypeLegitimate = new BehaviorSubject(true);

	profileForm: FormGroup = new FormGroup({
		profilePicture: new FormControl('', []),
		profileCover: new FormControl('', []),
		bio: new FormControl('', [Validators.maxLength(50)]),
		interests: new FormControl('', []),
		username: new FormControl(
			'',
			[Validators.pattern(/^[a-zA-Z0-9]*$/i)],
			[this.uniqueUsername.validate]
		),
		fullName: new FormControl('', [Validators.pattern(/^[a-z ,.'-]+$/i)]),
		sex: new FormControl('', [Validators.pattern(/'female'|'male'/)]),
	});

	constructor(
		private activatedRoute: ActivatedRoute,
		private readonly store: Store,
		private readonly checkImageService: CheckImageService,
		private uniqueUsername: UniqueUsername,
		private readonly cdref: ChangeDetectorRef
	) {
		super();
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
				this.checkImageService.mimeType(imageInput)
			);

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
				this.checkImageService.mimeType(imageInput)
			);
			// File Preview
			console.log(imageInput, this.profilePictureUrl);

			this.profileForm.controls['profilePicture'].setValue(
				imageInput.files[0] as File
			);
		}
	}

	onSubmit() {

		this.profileForm.controls['interests'].setValue(this.chips);

		if (
			!this.isProfileCoverMimeTypeLegitimate.value ||
			!this.isProfilePictureMimeTypeLegitimate.value
		) {
			return this.profileForm.setErrors({ invalid: true });
		}

		const updateProfile: Record<string, unknown> = {};

		for (const key in this.profileForm.value) {
			if (this.profileForm.value[key] === '' || !this.chips.length)
				delete this.profileForm.value[key];
		}

		console.log(this.profileForm.value);

		this.store.dispatch(new UpdateProfile(updateProfile));
	}
}
