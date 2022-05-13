import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from './modules/core.module';

@NgModule({
	imports: [CommonModule, CoreModule],
})
export class SharedModule {}
