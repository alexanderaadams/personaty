import { Injectable } from '@angular/core';
import { validImageMimeType } from '@core/models/valid-image-mime-type';
import { BehaviorSubject } from 'rxjs';

// export interface ICheckedMimeType {
// 	fileName: string;
// 	isImageMimeTypeValid: BehaviorSubject<boolean>;
// }

@Injectable({
	providedIn: 'root',
})
export class CheckImageService {
	isImageMimeTypeValid = new BehaviorSubject(false);

	mimeType(imageInput: any) {
		const storyImage = imageInput.files[0];

		// const fileName = storyImage.name;

		if (validImageMimeType.includes(storyImage.type))
			this.isImageMimeTypeValid.next(true);

		return this.isImageMimeTypeValid.value;
	}
}
