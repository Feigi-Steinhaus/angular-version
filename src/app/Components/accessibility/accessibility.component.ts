import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { KeyboardService } from '@app/Services/keyboard.service';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.css']
})
export class AccessibilityComponent {

  constructor(private el: ElementRef, private renderer: Renderer2, private keyboardService: KeyboardService
  ) { }

  speakPageContentEnabled: boolean = false;
  speechSynthesis: SpeechSynthesis = window.speechSynthesis;
  increaseFontSizeEnabled: boolean = false;
  zoomLevel: number = 1;
  initialZoomLevel: number = 1;

  toggleAccessibilityMenu() {
    const menu = document.getElementById('accessibility-menu');
    if (menu) {
      if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.style.display = 'flex';
      } else {
        menu.classList.add('hidden');
        menu.style.display = 'none';
      }
    }
  }

  toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
  }

  speakPageContent() {
    if (this.speakPageContentEnabled) {
      const pageContent = document.body.innerText;
      const speechSynthesis = window.speechSynthesis;
      const speechUtterance = new SpeechSynthesisUtterance(pageContent);

      speechSynthesis.speak(speechUtterance);
    } else {
      this.speechSynthesis.cancel();
    }
  }

  handleSwitch1Change(event: any): void {
    this.speakPageContentEnabled = event.checked;

    if (this.speakPageContentEnabled) {
      this.speakPageContent();
    } else {
      this.speechSynthesis.cancel();
    }
  }

  handleSwitch2Change(event: any): void {
    this.increaseFontSizeEnabled = event.checked;

    if (this.increaseFontSizeEnabled) {
      this.increaseFontSize();
    } else {
      this.increaseFontSizeRemove();
    }
  }

  increaseFontSize() {
    const elements = document.querySelectorAll('body *');
    elements.forEach((element: Element) => {
      if (element instanceof HTMLElement) {
        element.style.fontSize = 'large';
      }
    });
  }

  increaseFontSizeRemove() {
    const elements = document.querySelectorAll('body *');
    elements.forEach((element: Element) => {
      if (element instanceof HTMLElement) {
        element.style.fontSize = '';
      }
    });
  }

  handleSwitch8Change(event: any): void {
    this.increaseFontSizeEnabled = event.checked;
    if (this.increaseFontSizeEnabled) {
      this.highlightHeadings();
    } else {
      this.removeHighlightHeadings();
    }
  }

  highlightHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading: any) => {
      heading.style.backgroundColor = 'red';
    });
  }

  removeHighlightHeadings() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading: any) => {
      heading.style.backgroundColor = '';
    });
  }

  handleSwitch3Change(event: any): void {
    if (event.checked) {
      this.addUnderlineToText();
    } else {
      this.removeUnderlineFromText();
    }
  }

  removeUnderlineFromText() {
    const elements = document.querySelectorAll('body *');
    elements.forEach((element: Element) => {
      if (element instanceof HTMLElement) {
        element.style.textDecoration = '';
      }
    });
  }

  addUnderlineToText() {
    const elements = document.querySelectorAll('body *');
    elements.forEach((element: Element) => {
      if (element instanceof HTMLElement) {
        element.style.textDecoration = 'underline';
      }
    });
  }

  zoomIn() {
    this.zoomLevel += 0.1;
    document.body.style.transform = `scale(${this.zoomLevel})`;
  }

  handleSwitch6Change(event: any): void {
    if (event.checked) {
      this.zoomIn();
    } else {
      this.resetZoom();
    }
  }

  resetZoom() {
    this.zoomLevel = this.initialZoomLevel;
    document.body.style.transform = `scale(${this.zoomLevel})`;
  }

  // handleSwitch7Change(event: any): void {
  //   this.showKeyboard = event.checked;
  //   console.log(this.showKeyboard);

  //   if (this.showKeyboard) {
  //     this.toggleKeyboard();
  //   } else {
  //     this.closeKeyboard();
  //   }
  // }

  //   handleSwitch7Change(event: any): void {
  //     this.showKeyboard = event.checked;
  //     if (this.showKeyboard) {
  //       this.openKeyboard();
  //     } else {
  //       this.closeKeyboard();
  //     }
  //   }


//   //   @ViewChild('keyboardContainer', { static: false }) keyboardContainer!: ElementRef;
//   //   showKeyboard: boolean = true;

//   //   closeKeyboard() {
//   //     this.showKeyboard = false;
//   //   }

//   //   // openKeyboard() {
//   //   //   console.log(this.keyboardContainer);
//   //   //   if (this.keyboardContainer) {
//   //   //     alert("!!!!")
//   //   //     if (!this.keyboardService.isInitialized()) {
//   //   //       this.keyboardService.initialize(this.keyboardContainer.nativeElement);
//   //   //     }
//   //   //   } else {
//   //   //     console.error('keyboardContainer is undefined. Make sure it is properly initialized.');
//   //   //   }
//   //   // }

//   //   openKeyboard() {
//   //     if (this.keyboardContainer) {
//   //         this.keyboardService.resetKeyboard(); // Reset the keyboard service
//   //         this.keyboardService.initialize(this.keyboardContainer.nativeElement); // Reinitialize the keyboard
//   //         this.showKeyboard = true;
//   //     } else {
//   //         console.error('keyboardContainer is undefined. Make sure it is properly initialized.');
//   //     }
//   // }
 
  

//   @ViewChild('keyboardContainer', { static: false }) keyboardContainer!: ElementRef;
//   showKeyboard: boolean = false;

//   ngAfterViewInit() {
//     // This ensures that keyboardContainer is available after the view has initialized
//     console.log(this.keyboardContainer);
//   }

//   handleSwitch7Change(event: any): void {
//     this.showKeyboard = event.checked;
//     if (this.showKeyboard) {
//       this.openKeyboard();
//     } else {
//       this.closeKeyboard();
//     }
//   }

//   closeKeyboard() {
//     this.showKeyboard = false;
//   }

//   openKeyboard() {
//     if (this.keyboardContainer) {
//       if (!this.keyboardService.isInitialized()) {
//         this.keyboardService.initialize(this.keyboardContainer.nativeElement);
//       } else {
//         this.keyboardService.resetKeyboard(this.keyboardContainer.nativeElement);
//       }
//       this.showKeyboard = true;
//     } else {
//       console.error('keyboardContainer is undefined. Make sure it is properly initialized.');
//     }
//   }
// }












  @ViewChild('keyboardContainer', { static: false }) keyboardContainer?: ElementRef;
  showKeyboard: boolean = false;


  ngAfterViewInit() {
    // This will log the keyboardContainer after the view has initialized
    console.log(this.keyboardContainer); 
  }

  handleSwitch7Change(event: any): void {
    this.showKeyboard = event.checked;
    if (this.showKeyboard) {
      setTimeout(() => this.openKeyboard(), 0);
    } else {
      this.closeKeyboard();
    }
  }

  openKeyboard() {
    if (this.keyboardContainer?.nativeElement) {
      if (!this.keyboardService.isInitialized()) {
        this.keyboardService.initialize(this.keyboardContainer.nativeElement);
      } else {
        this.keyboardService.resetKeyboard(this.keyboardContainer.nativeElement);
      }
      this.showKeyboard = true;
    } else {
      console.error('keyboardContainer is undefined. Make sure it is properly initialized.');
    }
  }

  closeKeyboard() {
    this.showKeyboard = false;
  }
}
