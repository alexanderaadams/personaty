import { MatChipInputEvent } from '@angular/material/chips';
import randomColor from 'randomcolor';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { UnsubscribeOnDestroyAdapter } from '@persona/shared';

export class MaterialChips<T> extends UnsubscribeOnDestroyAdapter {
	readonly separatorKeysCodes: readonly [13, 188] = [ENTER, COMMA] as const;
	addOnBlur = true;
	chips: Array<T> = [];

	async add(event: MatChipInputEvent): Promise<void> {
		const value: string = (event.value ?? '').trim();

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
		event.chipInput?.clear();
	}

	remove(category: T): void {
		const index: number = this.chips.indexOf(category);

		if (index >= 0) {
			this.chips.splice(index, 1);
		}
	}
}
