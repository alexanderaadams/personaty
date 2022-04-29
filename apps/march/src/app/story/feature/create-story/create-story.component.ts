import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Actions, Store } from '@ngxs/store';

import { UnsubscribeOnDestroyAdapter } from '@march/authentication';
import { StoryService } from '../../data-access/services/story.service';
import { CreateStory } from '../../data-access/store/story.action';
import { finalize, Subscription } from 'rxjs';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
	selector: 'march-create-story',
	templateUrl: './create-story.component.html',
	styleUrls: ['./create-story.component.scss'],
})
export class CreateStoryComponent extends UnsubscribeOnDestroyAdapter {
	@Input()
	requiredFileType!: string;

	fileName = '';
	uploadProgress!: number | null;
	uploadSub!: Subscription;

	addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	categories: string[] = [];

	id: string = this.activatedRoute.snapshot.params['id'];

	storyForm: FormGroup = new FormGroup({
		category: new FormControl([''], [Validators.required]),
	});

	constructor(
		private http: HttpClient,
		private store: Store,
		private activatedRoute: ActivatedRoute,
		private actions$: Actions,
		private storyService: StoryService
	) {
		super();
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
		console.log({ ...this.storyForm.value, user_id: this.id });
		if (this.storyForm?.invalid || !this.storyForm.value) {
			return this.storyForm.setErrors({ invalid: true });
		}

		this.store.dispatch(
			new CreateStory({ ...this.storyForm.value, user_id: this.id })
		);
	}

	// onDismissClick() {
	// 	this.dismiss.emit(true);
	// }

	onFileSelected(event: any) {
		const file: File = event.target.files[0];

		if (file) {
			this.fileName = file.name;
			const formData = new FormData();
			formData.append('thumbnail', file);

			const upload$ = this.storyService
				.uploadStoryPhoto(formData, '6263fcf3dc01cf90f30db6bc')
				.pipe(finalize(() => this.reset()));

			this.uploadSub = upload$.subscribe((event: any) => {
				if (event.type == HttpEventType.UploadProgress) {
					this.uploadProgress = Math.round(100 * (event.loaded / event.total));
				}
			});
		}
	}

	cancelUpload() {
		this.reset();
	}

	reset() {
		this.uploadProgress = null;
		this.uploadSub.unsubscribe();
		// this.uploadSub = null;
	}
}
