import randomColor from 'randomcolor';
import { UnsubscribeOnDestroyAdapter } from '@persona/shared';
import { IonInput } from '@ionic/angular';

export class IonicChips<T> extends UnsubscribeOnDestroyAdapter {
	addOnBlur = true;
	chips: Array<T> = [];

	async add(event: IonInput): Promise<void> {
		console.log(event);
		const value: string | undefined = event.value?.toString().trim();

		// Add our fruit
		if (value) {
			this.chips.push({
				text: value,
				color: randomColor({
					luminosity: 'light',
					hue: 'random',
				}),
			} as unknown as T);
			// this.profileForm.controls['category'].setValue(this.chips);
		}

		// Clear the input value
		event.clearOnEdit = true;
		event.value = '';
	}

	remove(category: T): void {
		const index: number = this.chips.indexOf(category);

		if (index >= 0) {
			this.chips.splice(index, 1);
		}
	}
}
