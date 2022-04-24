import { BaseUI } from './base-ui.page';

export class searchResultPage extends BaseUI{
  element ={
    ...this.base,
    shortSelect : '//button[@data-unify="Select"]',
    shortSelectOption: (option:string) => `//button/span[text()="${option}"]`,
    item : (index:number)=> `//div[@data-testid="divSRPContentProducts"]//div[@class="css-jza1fo"][1]//div[@class="css-12sieg3"][${index}]//div[@data-testid="spnSRPProdName"]`,
  }

  shortSearchResultBasedOnOptions(option=''){
    if (option){
      this.select($(this.element.shortSelect),this.element.shortSelectOption(option) ,{selector:true})
    }
    return this
  }

  selectItemByIndex(index=4){
    browser.pause(2500)
    this.click($(this.element.item(index)))
    // this.awaitInteractableUI()
    return this
  }
}
