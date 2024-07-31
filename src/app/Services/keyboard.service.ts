import { Injectable } from '@angular/core';
import Keyboard from 'simple-keyboard';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  keyboard: Keyboard | null = null;
  activeInput: HTMLInputElement | null = null;
  activeFormControl: FormControl | null = null;
  initialized: boolean = false;

  initialize(container: HTMLElement) {
    if (!this.keyboard) {
      this.keyboard = new Keyboard(container, {
        onChange: input => this.onChange(input),
        onKeyPress: button => this.onKeyPress(button)
      });
      this.initialized = true;
    }
  }

  onChange(input: string) {
    if (this.activeInput) {
      this.activeInput.value = input;
    }
    if (this.activeFormControl) {
      this.activeFormControl.setValue(input);
      this.activeFormControl.markAsDirty();
      this.activeFormControl.markAsTouched();
    }
  }

  onKeyPress(button: string) {
    console.log("Button pressed", button);
  }

  setActiveInput(input: HTMLInputElement, formControl?: FormControl) {
    this.activeInput = input;
    this.activeFormControl = formControl ? formControl : null;
    if (this.keyboard) {
      this.keyboard.setInput(input.value);
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  resetKeyboard(container: HTMLElement) {
    if (this.keyboard) {
      this.keyboard.destroy();
      this.keyboard = null;
      this.initialized = false;
      this.initialize(container);
    }
  }
}
