import { Injectable } from '@angular/core';
import { validImageMimeType } from '@core/models/valid-image-mime-type';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class CheckImageService {


	isImageMimeTypeValid(imageInput: any) {
		const storyImage = imageInput.files[0];

		if (validImageMimeType.includes(storyImage.type))
		return true

		return false
	}
}
