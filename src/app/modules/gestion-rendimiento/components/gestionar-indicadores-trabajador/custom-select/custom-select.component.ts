import { Component, Input, Output, EventEmitter, forwardRef, ElementRef, ViewChild, Renderer2, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ]
})
export class CustomSelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = '[Seleccione]';
  @Output() selectionChange = new EventEmitter<string>();

  @ViewChild('trigger', { static: false }) trigger!: ElementRef;
  @ViewChild('dropdown', { static: false }) dropdown!: ElementRef;

  value: string = '';
  isOpen: boolean = false;
  isDisabled: boolean = false;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  constructor(private renderer: Renderer2, private cdr: ChangeDetectorRef) {}

  get displayValue(): string {
    if (!this.value || this.value === '') {
      return this.placeholder;
    }
    const option = this.options.find(opt => opt.value === this.value);
    return option ? option.label : this.placeholder;
  }

  toggleDropdown(): void {
    if (!this.isDisabled) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.onTouched();
        this.positionDropdown();
      }
    }
  }

  private positionDropdown(): void {
    if (!this.trigger || !this.dropdown) return;
    
    setTimeout(() => {
      const triggerEl = this.trigger.nativeElement;
      const dropdownEl = this.dropdown.nativeElement;
      const rect = triggerEl.getBoundingClientRect();
      
      // Calcular altura dinámica basada en opciones
      const optionHeight = 22; // altura aproximada por opción
      const dropdownHeight = this.options.length * optionHeight;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      
      // Posición horizontal
      this.renderer.setStyle(dropdownEl, 'left', `${rect.left}px`);
      
      // Posición vertical - mostrar arriba si no hay espacio abajo
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        this.renderer.setStyle(dropdownEl, 'top', `${rect.top - dropdownHeight - 2}px`);
      } else {
        this.renderer.setStyle(dropdownEl, 'top', `${rect.bottom + 2}px`);
      }
      
      // Forzar propiedades de visibilidad
      this.renderer.setStyle(dropdownEl, 'z-index', '2147483647');
      this.renderer.setStyle(dropdownEl, 'position', 'fixed');
    });
  }

  selectOption(option: SelectOption): void {
    if (this.isDisabled) return;
    
    console.log('Selecting option:', option);
    
    // Actualizar valor interno
    this.value = option.value;
    this.isOpen = false;
    
    // Notificar a Angular Forms (esto actualiza el ngModel del padre)
    this.onChange(option.value);
    this.onTouched();
    
    // Emitir evento personalizado
    this.selectionChange.emit(option.value);
    
    // Forzar actualización de la vista
    this.cdr.detectChanges();
    
    console.log('Value after selection:', this.value);
    console.log('Display value:', this.displayValue);
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  trackByValue(index: number, option: SelectOption): string {
    return option.value;
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value || '';
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}