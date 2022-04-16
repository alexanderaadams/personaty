import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { MaterialModule } from '@march/authentication';

@NgModule({
	declarations: [ProfileComponent],
	imports: [CommonModule, ProfileRoutingModule, MaterialModule],
	exports: [],
})
export class ProfileModule {}
