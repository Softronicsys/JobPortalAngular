//import { TestBed, ComponentFixture, async, fakeAsync, tick } from '@angular/core/testing';

///*Modules*/
//import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
//import { MatTooltipModule } from '@angular/material';

///*Components*/
//import { DatePickerComponent } from './date-picker.component';

///*Pipes*/
//import { WrapPipe } from '../../pipes/wrap/wrap.pipe';

///*Directives*/
//import { NumericInput } from '../../directives/numeric-input/numeric-input.directive';


//describe('DatePicker', () => {

//    let component: DatePickerComponent;
//    let fixture: ComponentFixture<DatePickerComponent>;

//    let datePickerObj = {
//        isValid: true,
//        month: '02',
//        day: '12',
//        year: '2018',
//        monthName: 'Feb',
//        date: '12-02-2018',
//        displayDate: '12-Feb-2018',
//        dbDate: '2018-02-12'
//    }

//    beforeEach(async(() => {
//        TestBed.configureTestingModule({
//            imports: [
//                FormsModule,
//                ReactiveFormsModule,
//                NgxMyDatePickerModule.forRoot(),
//                MatTooltipModule
//            ],
//            declarations: [
//                DatePickerComponent,
//                WrapPipe
//            ],
//            providers: [
//                DatePickerComponent
//            ]
//        })
//    }));

//    beforeEach(() => {
//        fixture = TestBed.createComponent(DatePickerComponent);
//        component = fixture.componentInstance;
//        fixture.detectChanges();
//    });

//    it("Date Picker component created", () => {
//        expect(component).toBeTruthy();
//    })

//    it('should not have Invalidcondtion object after construction', () => {
//        expect(component.isInValidCondition).toBeUndefined();
//    });

//    it('should not have @isRequired object after construction', () => {
//        expect(component.isRequired).toBe(false, 'False at first');
//        component.isRequired = true;
//        expect(component.isRequired).toBe(true, 'True after change');
//        component.isRequired = false;
//        expect(component.isRequired).toBe(false, 'Revert to default false');
//    });

//    it("Valid Year Validate expression", () => {
//        expect(component.yearRegEX.test('1234')).toBe(true);
//    })

//    it("In-Valid Year Validate expression", () => {
//        expect(component.yearRegEX.test('124')).toBe(false);
//    })

//    it("Default Value Success", () => {
//        let val = "12-02-2018";
//        component.pickerChange.subscribe(data => {
//            expect(JSON.stringify(data)).toBe(JSON.stringify(datePickerObj));
//        })
//        component.handleDefaultValue(val);
//    })

//    it("Default Value Fail", () => {
//        let val = "12-03-2018";
//        component.pickerChange.subscribe(data => {
//            expect(JSON.stringify(data)).not.toBe(JSON.stringify(datePickerObj))
//        })
//        component.handleDefaultValue(val);
//    })

//    it("Date Changed from Picker Success", () => {
//        let eventValue = {
//            date: {
//                month: '2',
//                day: '12',
//                year: '2018'
//            }
//        }
//        component.pickerChange.subscribe(data => {
//            expect(JSON.stringify(data)).toBe(JSON.stringify(datePickerObj));
//        })
//        component.onDateChanged(eventValue);
//    })

//    it("Date Changed from Picker Fail", () => {
//        let eventValue = {
//            date: {
//                month: 11,
//                day: 12,
//                year : 2017
//            }
//        }
//        component.pickerChange.subscribe(data => {
//            expect(JSON.stringify(data)).not.toBe(JSON.stringify(datePickerObj));
//        })
//        component.onDateChanged(eventValue);
//    })

//    //it("validate server error message", async(() => {
//    //    component.serverObj = {
//    //        isError: true,
//    //        msg: "Hello Error"
//    //    };

//        /*fixture.detectChanges();
//        const compiled = fixture.debugElement.nativeElement;
//        expect(compiled.querySelectorAll('div')[1].textContent).toContain("Hello Error");*/

//    //    fixture.whenStable()
//    //        .then(() => {
//    //            fixture.detectChanges();
//    //            return fixture.whenStable();
//    //        })
//    //        .then(() => {
//    //            const compiled = fixture.debugElement.nativeElement;
//    //            expect(compiled.querySelectorAll('p')[0].textContent).toContain("Hello Error");

//    //            /*innerText*/
//    //        })
//    //}));

    

//})