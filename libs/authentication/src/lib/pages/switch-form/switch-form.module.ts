import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SwitchFormComponent } from './switch-form.component';
import { RouterModule } from '@angular/router';

@NgModule({
	declarations: [SwitchFormComponent],
	imports: [CommonModule, IonicModule, RouterModule],
	exports: [SwitchFormComponent],
	providers: [SwitchFormComponent],
})
export class SwitchFormModule {}
