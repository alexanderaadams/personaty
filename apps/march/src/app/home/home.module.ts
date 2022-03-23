import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { AuthModule } from '@march/authentication';

@NgModule({
	declarations: [HomeComponent],

	imports: [CommonModule, HomeRoutingModule, AuthModule],
})
export class HomeModule {}
