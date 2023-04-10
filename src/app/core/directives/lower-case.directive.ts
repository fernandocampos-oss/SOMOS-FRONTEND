import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appLowercase]',
})
export class LowercaseDirective {
  lastValue: string;

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput($event: any) {
    const start = $event.target.selectionStart;
    const end = $event.target.selectionEnd;
    $event.target.value = $event.target.value.toLowerCase();
    $event.target.setSelectionRange(start, end);
    $event.preventDefault();

    // Garante que o último caractere digitado fique minúsculo
    if (
      !this.lastValue ||
      (this.lastValue &&
        $event.target.value.length > 0 &&
        this.lastValue !== $event.target.value)
    ) {
      this.lastValue = this.el.nativeElement.value = $event.target.value;
      // Propagation
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('input', false, true);
      $event.target.dispatchEvent(evt);
    }
  }
}
