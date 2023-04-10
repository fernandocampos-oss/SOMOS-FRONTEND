import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumeric]',
})
export class NumericDirective {
  private _navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste',
  ];
  private _allowCtrlKeys = [
    'a', // Ctrl+A
    'c', // Ctrl+C
    'v', // Ctrl+V
    'x', // Ctrl+X
  ];

  private _allowCmdKeys = [
    'a', // Cmd+A (Mac)
    'c', // Cmd+C (Mac)
    'v', // Cmd+V (Mac)
    'x', // Cmd+X (Mac)
  ];
  constructor(private el: ElementRef) {}

  @HostListener('keypress', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    const isKeyAllow =
      this._navigationKeys.indexOf(e.key) > -1 ||
      (this._allowCtrlKeys.includes(e.key) && e.ctrlKey) ||
      (this._allowCmdKeys.includes(e.key) && e.metaKey);
    if (isKeyAllow) {
      return;
    }
    if (e.key === ' ' || isNaN(Number(e.key))) {
      e.preventDefault();
    }
  }
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedInput: string = event.clipboardData
      .getData('text/plain')
      .replace(/\D/g, '');
    document.execCommand('insertText', false, pastedInput);
  }
  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {
    event.preventDefault();
    const textData = event.dataTransfer.getData('text').replace(/\D/g, '');
    this.el.nativeElement.focus();
    document.execCommand('insertText', false, textData);
  }
}
