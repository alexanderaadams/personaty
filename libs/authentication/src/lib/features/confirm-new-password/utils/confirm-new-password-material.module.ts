import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
	imports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
	exports: [MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
})
export class ConfirmNewPasswordMaterialModule {}
