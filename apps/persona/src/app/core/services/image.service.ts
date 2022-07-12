import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '@persona/shared';
import { ToastController } from '@ionic/angular';

@Injectable({
	providedIn: 'root',
})
export class ImageService {
	validImageMimeType = ['image/png', 'image/jpeg', 'image/webp'];

	constructor(
		private readonly toastController: ToastController,
		private readonly http: HttpClient
	) {}

	isImageMimeTypeValid(imageInput: HTMLInputElement) {
		const storyImage = imageInput?.files?.[0];

		if (this.validImageMimeType.includes(storyImage?.type ?? '')) return true;

		return false;
	}

	read(imageInput: HTMLInputElement) {
		const HtmlImage = new BehaviorSubject<
			string | ArrayBuffer | null | undefined
		>(null);

		if (imageInput.files && imageInput.files[0]) {
			const reader = new FileReader();

			if (!this.isImageMimeTypeValid(imageInput)) {
				this.toastController
					.create({
						message: 'Please upload the correct Photo',
						duration: 3000,
						color: 'danger',
					})
					.then((toast: any) => toast.present());

				return { valid: false };
			}

			reader.onloadend = (e) => {
				// function call once readAsDataUrl is completed

				HtmlImage.next(e?.target?.['result']); // Set image in element
				// this.cdref.markForCheck(); // Is called because ChangeDetection is set to onPush
			};

			reader.readAsDataURL(imageInput.files[0]); // Read file as data url
		}

		return {
			RawImage: imageInput?.files?.[0] as File,
			HtmlImage: HtmlImage,
			valid: true,
		};
	}

	getImage(id: string, imageName: string) {
		const imageUrl = `${environment.BACKEND_URL}/
		${environment.BACKEND_BASE_URL}/
		picture/
		${id}/
		${imageName}`;
		const imageToShow = new BehaviorSubject<string | ArrayBuffer | null>(null);
		const reader = new FileReader();

		this.http
			.get(imageUrl, {
				responseType: 'blob',
				withCredentials: true,
			})
			.pipe(take(1))
			.subscribe({
				next: (image: Blob) => {
					reader.addEventListener(
						'load',
						() => {
							imageToShow.next(reader.result);
						},
						false
					);

					if (image) {
						reader.readAsDataURL(image);
					}
				},
			});

		return imageToShow;
	}
}
