import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[NumericInput]'
})
export class NumericInput {

    constructor(private el: ElementRef) { }

    @HostListener('keypress', ['$event']) onkeypress(event) {
        let evt = <KeyboardEvent>event;
      
        if (evt.which != 8 && evt.which != 0 && evt.which < 45 || evt.which > 57) {
            return evt.preventDefault();
        }
    }
}


//import { Directive, ElementRef, HostListener, Input, Renderer } from '@angular/core';

//@Directive({
//    selector: '[NumericInput]'
//})
//export class NumericInput {

//    constructor(private el: ElementRef<any, any>, renderer: Renderer) {
//        var events = 'cut copy paste';
//        events.split(' ').forEach(e =>
//            renderer.listen(el.nativeElement, e, (event) => {
//                event.preventDefault();
//            })
//        );
//    }

//    @HostListener('keypress', ['$event']) onkeypress(event) {
//        let evt = <KeyboardEvent>event;
//        if (evt.which != 8 && evt.which != 0 && evt.which < 48 || evt.which > 57) {
//            return evt.preventDefault();
//        }
//    }
//}
