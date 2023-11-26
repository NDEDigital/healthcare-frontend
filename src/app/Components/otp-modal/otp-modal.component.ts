import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-otp-modal',
  templateUrl: './otp-modal.component.html',
  styleUrls: ['./otp-modal.component.css'],
})
export class OtpModalComponent {
  @Output() dataChanged = new EventEmitter<string>();

  otpValue: number | null = null;
  error = false;
  remainingTime = 0;
  enableResendBTN = false;
  constructor(private cdr: ChangeDetectorRef) {}
  ngOnInit() {}
  verifyOTP() {
    if (this.otpValue !== null && this.otpValue.toString().length === 6) {
      this.error = false;
      console.log('OTP:', this.otpValue);
       this.dataChanged.emit(this.otpValue.toString());
    } else {
      this.error = true;
    }
  }

  onInput(event: any) {
    let inputValue = event.target.value;
    if (inputValue.toString().length > 6) {
      inputValue = inputValue.substring(0, 6);
      event.target.value = inputValue.substring(0, 6);
    }
    if (this.otpValue != null) this.otpValue = parseInt(inputValue); // Convert the value to a number
  }
  initializeTimer() {
    this.remainingTime = 10;
    this.startTimer();
  }
  startTimer() {
    console.log('start timer');

    const interval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      }
      console.log(this.remainingTime, 'this.remainingTime');
    }, 1000);

    setTimeout(() => {
      console.log('clearInterval');
      this.enableResendBTN = true;
      clearInterval(interval);
    }, this.remainingTime * 1000);
  }
  secondsToMinutesAndSeconds(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secondsRemaining = seconds % 60;

    return `${minutes}:${secondsRemaining.toString().padStart(2, '0')}`;
  }
  resendOTP() {
    console.log('resend otp');
    this.remainingTime = 10;
    this.startTimer();
    this.error = false;
    this.otpValue = null;
  }
}
