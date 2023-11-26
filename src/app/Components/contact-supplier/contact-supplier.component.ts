import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-contact-supplier',
  templateUrl: './contact-supplier.component.html',
  styleUrls: ['./contact-supplier.component.css'],
})
export class ContactSupplierComponent implements OnInit {
  public buttonText: string = '';
  ngOnInit() {
    // const fileUpload = document.getElementById('file-upload');
    // const fileUpload = document.getElementById('file-upload');
    // const paperclipIcon = document.querySelector('.upload');
    // paperclipIcon!.addEventListener('click', function () {
    //   fileUpload!.click();
    // });
    // Question suggestions
    // const textArea = this.textAreaRef.nativeElement;
    // const buttons: NodeListOf<HTMLButtonElement> =
    //   document.querySelectorAll('button');
    // buttons.forEach((btn) => {
    //   btn.addEventListener('click', () => {
    //     console.log('Button clicked!');
    //     this.buttonText = btn.textContent!;
    //     console.log(this.buttonText, 'btntext');
    //     if (textArea && this.buttonText) {
    //       textArea.value += this.buttonText + ' ';
    //       console.log(textArea.value);
    //     }
    //   });
    // });
  }
  selectedFile: File | undefined;
  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files) {
      this.selectedFile = inputElement.files[0];
    }
  }
  @ViewChild('textArea') textAreaRef!: ElementRef<HTMLTextAreaElement>;

  addQuestion(event: MouseEvent) {
    const textArea = this.textAreaRef.nativeElement;
    const buttonText = (event.target as HTMLButtonElement).textContent;

    if (textArea && buttonText) {
      textArea.value += buttonText + ' ';
      // console.log(textArea.value);
    }
  }
  // addQuestion() {
  //   const textArea = this.textAreaRef.nativeElement;
  //   const buttons: NodeListOf<HTMLButtonElement> =
  //     document.querySelectorAll('button');
  //   buttons.forEach((btn) => {
  //     btn.addEventListener('click', () => {
  //       console.log('Button clicked!');
  //       this.buttonText = btn.textContent!;
  //       console.log(this.buttonText, 'btntext');
  //       if (textArea && this.buttonText) {
  //         textArea.value += this.buttonText + ' ';
  //         console.log(textArea.value);
  //       }
  //     });
  //   });
  //   // if (textArea && this.buttonText) {
  //   //   textArea.value += this.buttonText + ' ';
  //   //   console.log(textArea.value);
  //   // }
  // }
}
