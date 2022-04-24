import { UIInteraction } from "../../ui-interaction";

export abstract class BaseUI extends UIInteraction {

  protected base = {
    searchProductInput: '//input[@aria-label="Bidang pencarian"]',
    searchProductButton : '//button[@aria-label="Tombol pencarian"]',
    chartButton : '//div[@data-testid="btnHeaderCart"]/div/i',
    loginButton : '//button[@data-testid="btnHeaderLogin"]',
    RegisterButton : '//button[@data-testid="btnHeaderRegister"]',
    deliverySelectionButton: '//p[@data-unify="Typography"][text()="Pilih Alamat Pengirimanmu"]',
    closeModalButton:'//button[@aria-label="Tutup tampilan modal"]',
    deliveryInfoBanner:'//h4[text()="Bisa pilih alamat pengirimanmu dulu"]',
    delivertInfoBannerNextButton: '//div[contains(@class,"unf-coachmark__action-wrapper")]',
  };
  // Elements seen in most UI
  protected frequent_element = {};

  awaitInteractableUI () {
    // TODO:
  }

  closeInfoBanner(){
    browser.pause(1500)
    if ($(this.base.deliveryInfoBanner).isExisting()){
      this.click($(this.base.delivertInfoBannerNextButton))
    }
  }
  selectDelivery(option=''){
    this.click($(this.base.deliverySelectionButton))
    if (option){
      //to do select the delivery base on option
    }else{
      this.click($(this.base.closeModalButton))
    }
    return this
  }
  searchProduct(product=''){
    if(product){
      browser.pause(2000)
      this.enter($(this.base.searchProductInput), product)
      this.click($(this.base.searchProductButton))
    }
    return this
  }

}
