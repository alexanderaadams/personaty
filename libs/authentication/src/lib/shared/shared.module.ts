import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from './input/input.component';
import { ModalComponent } from './modal/modal.component';
import { DateComponent } from './date/date.component';

@NgModule({
  declarations: [InputComponent, ModalComponent, DateComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [InputComponent, ModalComponent,DateComponent]
})
export class SharedModule {}
