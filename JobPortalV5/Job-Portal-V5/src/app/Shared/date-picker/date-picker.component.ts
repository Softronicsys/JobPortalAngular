import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { INgxMyDpOptions } from 'ngx-mydatepicker';
//import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
//import 'rxjs/add/operator/debounceTime';
//import 'rxjs/add/operator/distinctUntilChanged';
//import { distinctUntilChanged } from 'rxjs/Operators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { pipe } from 'rxjs';

@Component({
    selector: 'date-picker',
    templateUrl: './date-picker.component.html',
    styles: [`
            input[type=number]::-webkit-inner-spin-button, 
            input[type=number]::-webkit-outer-spin-button { 
                -webkit-appearance: none;
                -moz-appearance: none;
                appearance: none;
                margin: 0;
              },
            `]
})
export class DatePickerComponent implements OnInit {

    @Output() pickerChange = new EventEmitter<any>();
    @Input() isRequired: boolean = false;
    // TODO 
    @Input() inValidDate: boolean = false;
    @Input() isDisabled: boolean = false;
    @Input() isInValidCondition;
    @Input() set defaultValue(data: string) {

        if (data) {
            this.handleDefaultValue(data);
        }
    }
    @Input() serverObj = {
        isError: false,
        msg: ""
    }


    //inValidDate: boolean = false;
    yearRegEX: RegExp = /^\d{4}$/;
    calenderMonths: { id: string, name: string, RegEx: any }[] = [
        { id: '0', name: 'MMM', RegEx: /^$/ },
        { id: '01', name: 'Jan', RegEx: /^([1-9]|[12]\d|3[0-1])$/ },
        { id: '02', name: 'Feb', RegEx: /^([1-9]|[12]\d|2[0-9])$/ },
        { id: '03', name: 'Mar', RegEx: /^([1-9]|[12]\d|3[0-1])$/ },
        { id: '04', name: 'Apr', RegEx: /^([1-9]|[12]\d|3[0])$/ },
        { id: '05', name: 'May', RegEx: /^([1-9]|[12]\d|3[0-1])$/ },
        { id: '06', name: 'Jun', RegEx: /^([1-9]|[12]\d|3[0])$/ },
        { id: '07', name: 'Jul', RegEx: /^([1-9]|[12]\d|3[0-1])$/ },
        { id: '08', name: 'Aug', RegEx: /^([1-9]|[12]\d|3[0-1])$/ },
        { id: '09', name: 'Sep', RegEx: /^([1-9]|[12]\d|3[0])$/ },
        { id: '10', name: 'Oct', RegEx: /^([1-9]|[12]\d|3[0-1])$/ },
        { id: '11', name: 'Nov', RegEx: /^([1-9]|[12]\d|3[0])$/ },
        { id: '12', name: 'Dec', RegEx: /^([1-9]|[12]\d|3[0-1])$/ }
    ]

    datePickerForm: FormGroup;
    reset = this.resetDatePickerForm;
    formChangeDetector;

    myOptions: INgxMyDpOptions = {
        dateFormat: 'dd.mm.yyyy',
    };

    constructor(private fb: FormBuilder) {
        this.createDatePickerForm();
    }

    ngOnInit() {     
        this.subscribeChanges();
    }

    //Create Date Picker Form Feilds
    createDatePickerForm() {
        this.datePickerForm = this.fb.group({
            dd: [null],
            mm: [0],
            yyyy: [null],
            pickerModel: [null]
        });
    }

    // Reset Date Picker form feilds
    resetDatePickerForm() {
        this.unSubscribeChanges();
        this.datePickerForm.reset();
        this.datePickerForm.patchValue({
            mm: 0
        })
        this.inValidDate = false;
        this.subscribeChanges();
    }

    emitChangeEvent(obj) {
        this.pickerChange.emit(obj);
        this.inValidDate = false;
    }

    // When date is invalid
    emitChangeEvent1(dd, mm, yyyy) {
        var monthName = this.calenderMonths[parseInt(mm)] ? this.calenderMonths[parseInt(mm)].name : mm;
        this.pickerChange.emit({
            isValid: false,
            month: mm,
            monthName: monthName,
            day: dd,
            year: yyyy,
            date: dd + '-' + mm + '-' + yyyy,
            displayDate: dd + '-' + monthName + '-' + yyyy,
            dbDate: yyyy + '-' + mm + '-' + dd,
        });
        this.checkAllFeildsDirty();
    }

    //Update vlaue in  form Feilds
    updateFormFeilds(dd, mm, yyyy) {
        this.datePickerForm.setValue({
            dd: dd,
            mm: mm,
            yyyy: yyyy,
            pickerModel: { date: { year: +yyyy, month: +mm, day: +dd } }
        })
    }

    // Check the year is leap or not
    isLeapYear(year) {
        return new Date(year, 1, 29).getDate() === 29;
    }

    // ::CASE 01:: Call when date is select from picker 
    onDateChanged(event) {
        var mm = event.date.month;
        var dd = event.date.day;
        var yyyy = event.date.year;
        if (event.date.month < 10) {
            mm = '0' + mm;
        }
        if (event.date.day < 10) {
            dd = '0' + dd;
        }
        this.unSubscribeChanges();
        this.updateFormFeilds(dd, mm, yyyy);
        this.subscribeChanges();

        this.emitChangeEvent({
            isValid: true,
            month: mm,
            day: dd,
            year: yyyy,
            monthName: this.calenderMonths[parseInt(mm)].name,
            date: dd + '-' + mm + '-' + yyyy,
            displayDate: dd + '-' + this.calenderMonths[parseInt(mm)].name + '-' + yyyy,
            dbDate: yyyy + '-' + mm + '-' + dd
        });
    }

    // ::CASE 02:: Call When any default date is provided
    handleDefaultValue(date) {
        var splittedDate = date.split('-');
        if (splittedDate.length == 3) {
            var dd = splittedDate[0];
            var mm = splittedDate[1];
            var yyyy = splittedDate[2];
            if (!this.yearRegEX.test(yyyy)) {         // Check Year
                this.resetDatePickerForm();
                return this.emitChangeEvent1(dd, mm, yyyy);
            }
            if (mm != 0 && mm < 13) {                 // Check Month
                if (mm == 2 && dd == 29 && !this.isLeapYear(yyyy)) {      //Check is Leap Year
                    this.resetDatePickerForm();
                    return this.emitChangeEvent1(dd, mm, yyyy);
                }
                if (mm.length == 1 && mm < 10) {
                    mm = '0' + mm;
                }
                if (!this.calenderMonths[parseInt(mm)].RegEx.test(+dd)) {        // Check Date
                    this.resetDatePickerForm();
                    return this.emitChangeEvent1(dd, mm, yyyy);
                }
                this.unSubscribeChanges();
                this.updateFormFeilds(dd, mm, yyyy);                // Update form and emit event before validate date
                this.emitChangeEvent({
                    isValid: true,
                    month: mm,
                    day: dd,
                    year: yyyy,
                    monthName: this.calenderMonths[parseInt(mm)].name,
                    date: dd + '-' + mm + '-' + yyyy,
                    displayDate: dd + '-' + this.calenderMonths[parseInt(mm)].name + '-' + yyyy,
                    dbDate: yyyy + '-' + mm + '-' + dd
                });
                return this.subscribeChanges();

            } else {
                this.resetDatePickerForm();
                return this.emitChangeEvent1(dd, mm, yyyy);
            }
        } else {
            this.resetDatePickerForm();
            return this.emitChangeEvent1(splittedDate[0], splittedDate[1], splittedDate[2]);
        }
    }

    unSubscribeChanges() {
        this.formChangeDetector && this.formChangeDetector.unsubscribe();
    }

    subscribeChanges() {
        if (this.formChangeDetector && !this.formChangeDetector.closed) {
            return;
        }
        const debouncetime = pipe(debounceTime(200));
        this.formChangeDetector = this.datePickerForm.valueChanges
            .pipe(debouncetime,
            distinctUntilChanged())
            .subscribe((val: any) => {
                if (val.dd && val.mm != 0 && val.yyyy) {
                    var dd = val.dd.toString();
                    var mm = val.mm;
                    var yyyy = val.yyyy.toString();
                    if (dd.length > 2) {
                        var splitDD = dd.split('');
                        splitDD = splitDD[0] + splitDD[1];
                        this.unSubscribeChanges();
                        this.datePickerForm.patchValue({
                            dd: splitDD
                        })
                        dd = splitDD;
                        this.subscribeChanges();
                    }
                    if (yyyy.length > 4) {
                        var splitYYYY = yyyy.split('');
                        splitYYYY = splitYYYY[0] + splitYYYY[1] + splitYYYY[2] + splitYYYY[3];
                        this.unSubscribeChanges();
                        this.datePickerForm.patchValue({
                            yyyy: splitYYYY
                        })
                        yyyy = splitYYYY;
                        this.subscribeChanges();
                    }
                    if (!this.yearRegEX.test(yyyy)) {         // Check Year
                        return this.emitChangeEvent1(dd, mm, yyyy);
                    }
                    if (mm != 0 && mm < 13) {                 // Check Month
                        if (mm == 2 && dd == 29 && !this.isLeapYear(yyyy)) {      //Check is Leap Year
                            return this.emitChangeEvent1(dd, mm, yyyy);
                        }
                        if (mm.length == 1 && mm < 10) {
                            mm = '0' + mm;
                        }
                        if (!this.calenderMonths[parseInt(mm)].RegEx.test(+dd)) {        // Check Date
                            return this.emitChangeEvent1(dd, mm, yyyy);
                        }
                        this.unSubscribeChanges();
                        this.datePickerForm.patchValue({
                            pickerModel: { date: { year: +yyyy, month: +mm, day: +dd } }
                        })
                        this.subscribeChanges();
                        return this.emitChangeEvent({
                            isValid: true,
                            month: mm,
                            day: dd,
                            year: yyyy,
                            monthName: this.calenderMonths[parseInt(mm)].name,
                            date: dd + '-' + mm + '-' + yyyy,
                            displayDate: dd + '-' + this.calenderMonths[parseInt(mm)].name + '-' + yyyy,
                            dbDate: yyyy + '-' + mm + '-' + dd
                        });

                    } else {
                        this.resetDatePickerForm();
                        return this.emitChangeEvent1(dd, mm, yyyy);
                    }
                } else {
                    return this.emitChangeEvent1(val.dd, val.mm, val.yyyy);
                }
                
            });
    }

    checkAllFeildsDirty() {
        var controls = this.datePickerForm.controls;
        if (controls['dd'].dirty && controls['mm'].dirty && controls['yyyy'].dirty) {
            this.inValidDate = true;
            return;
        }
        var val = this.datePickerForm.value;
        if (val.dd && val.yyyy) {
            this.inValidDate = true;
            return;
        }
    }
}
