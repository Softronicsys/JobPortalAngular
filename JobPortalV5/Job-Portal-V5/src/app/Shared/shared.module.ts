import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NumericInput } from '../Shared/numeric-input/numeric-input.directive';

import { DatePickerComponent } from './date-picker/date-picker.component';
import { DataService } from './Services/data.services';;
import { WordTruncatePipe } from './WordPipe/word-truncate.pipe'

@NgModule({
  imports: [
      CommonModule,
      NgxMyDatePickerModule.forRoot(),
      ReactiveFormsModule,
      FormsModule
  ],
  declarations: [
      DatePickerComponent,
      NumericInput,
      WordTruncatePipe
  ],
  exports: [
      DatePickerComponent,
      NumericInput,
      WordTruncatePipe
  ],
  providers: [
      DataService
  ]
})

export class SharedModule { }
