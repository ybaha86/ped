import { UIInteraction } from 'packages/core/ui-interaction';
import { BaseUI } from './base-ui.page';
import { totp } from '@qa/helper';

export class loginPage extends BaseUI{
  element ={
    ...this.base,
    emailInput : '//input[@data-testid="email-phone-input"]',
    submiEmailBtn : '//button[@data-testid="email-phone-submit"]',
    passwordInput : '//input[@id="password-input"]',
    submitPassButton : '//button[@type="submit"]',
    totpInput : '//input[@aria-label="otp input"]',
  }

  private submitEmail(email:string){
    if (email){
      this.enter($(this.element.emailInput), email)
      this.click($(this.element.submiEmailBtn))
    }
  }
  private submitPassword(password:string){
    if (password){
      this.enter($(this.element.passwordInput), password)
      this.click($(this.element.submitPassButton))
    }
  }
  private submittOtp(googleSecret:string){
    if (googleSecret){
      const otp = totp.generate(googleSecret)
      this.await($(this.element.totpInput), { state: UIInteraction.EXIST})
      this.enter($(this.element.totpInput), otp)
    }
  }
  submitLogin(email='', password='', googleSecret=''){
    this.submitEmail(email); browser.pause(2000);
    this.submitPassword(password); browser.pause(2000);
    this.submittOtp(googleSecret); browser.pause(2000);
    return this
  }
}
