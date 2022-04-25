import { BaseUI } from './base-ui.page';

export class itemDetailsPage extends BaseUI{
  element = {
    ...this.base,
    buyButton : '//button[@data-testid="pdpBtnNormalSecondary"]',
    addToChartButton : '//button[@data-testid="pdpBtnNormalPrimary"]'
  }

  buyItem(){
    browser.pause(5000); this.click($(this.element.buyButton))
  }
}
