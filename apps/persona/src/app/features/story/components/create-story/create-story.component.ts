import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { CreateStory } from '@features/story/data-access/state/story.action';
import { Store } from '@ngxs/store';
import { MaterialChips } from '@core/utils/material-chips';
import { CheckImageService } from '@core/services/check-image.service';

import { IInterestAndBioAndCategory } from '../../data-access/state/story.model';

@Component({
	selector: 'persona-create-story',
	templateUrl: './create-story.component.html',
	styleUrls: ['./create-story.component.scss'],
})
export class CreateStoryComponent extends MaterialChips<IInterestAndBioAndCategory> {
	id: string = this.activatedRoute.snapshot.params['id'];
	checkedMimeType!: BehaviorSubject<boolean>;

	storyForm: FormGroup = new FormGroup({
		category: new FormControl([''], [Validators.required]),
		storyImage: new FormControl('', [Validators.required]),
	});

	constructor(
		private activatedRoute: ActivatedRoute,
		private readonly store: Store,
		private checkImageService: CheckImageService
	) {
		super();
	}

	storyImageSelected(imageInput: any): void {
		// this.checkedMimeType = this.checkImageService.mimeType(imageInput);

		// const reader = new FileReader();

		// reader.readAsDataURL(storyImage);

		this.storyForm.controls['storyImage'].setValue(imageInput.files[0] as File);
	}

	onSubmit(): void {
		this.storyForm.controls['category'].setValue(this.chips);
		if (
			this.storyForm?.invalid ||
			!this.storyForm.value ||
			this.checkedMimeType.value
		) {
			this.storyForm.setErrors({ invalid: true });
		}

		this.store.dispatch(new CreateStory({ ...this.storyForm.value }));
	}
}
