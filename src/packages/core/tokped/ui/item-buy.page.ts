import waitForExist from 'webdriverio/build/commands/element/waitForExist';
import { BaseUI } from './base-ui.page';

export class itemBuy extends BaseUI{
  element = {
    ...this.base,
    changePaymentMethodButton : '//button[@data-testid="occBtnPayment"]',
    payButton : '//button[@id="btn-quickpay-pay"]',
    otherOptionButton : '//div[@data-testid="occProfilePayment"]//div/button/*',
    chooseCC : '//div[text()="Kartu Kredit / Cicilan"]',
    addCCButton : '//button[@class="unf-btn"]',
    inputCCNumber : '//input[@id="bankNumber"]',
    inputCCMonth : '//input[@id="card-month"]',
    inputCCYear : '//input[@id="card-years"]',
    inputCCCvv : '//input[@id="cvvNumber"]',
    saveCC : '//div[@class = "btn-floating"]/a[text()="Simpan"]',
    msgError : '//*[text()="Nomor Kartu tidak valid"]',
    txtPilihPembayaran : '//*[text()="Kartu Kredit"]'

    //addToChartButton : '//button[@data-testid="pdpBtnNormalPrimary"]'
  }


  selectPayment(){
    browser.switchToFrame($('//iframe[@name="ecl-add-cc-iframe"]'))
    //Fill CC Number, Month, Year & CVV
    this.enter($(this.element.inputCCNumber),"1111 1111 1111 1111")
    this.enter($(this.element.inputCCMonth),"12")
    this.enter($(this.element.inputCCYear),"24")
    this.enter($(this.element.inputCCCvv),"123")
    this.click($(this.element.saveCC))
    this.expect(this.element.msgError,"Expect alert display").toBeDisplayed()
  }
  changePayment(){
    browser.pause(2500)
    this.click($(this.element.otherOptionButton))//Choose Payment Method Option
    browser.pause(2500)
    browser.switchToFrame($('//iframe[@name="iframe-occ-change-payment"]'))
    console.log($(this.element.txtPilihPembayaran).isExisting())
    if($(this.element.txtPilihPembayaran).isExisting()){
      this.click($(this.element.chooseCC)) //Select Credit card
      browser.pause(2500)
      this.click($(this.element.addCCButton)) //Add CC Number
      browser.pause(2500)
      this.selectPayment();

    }




  }


}
