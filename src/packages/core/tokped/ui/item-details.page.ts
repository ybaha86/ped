import { BaseUI } from './base-ui.page';

export class itemDetailsPage extends BaseUI{
  element = {
    ...this.base,
    buyButton : '//button[@data-testid="pdpBtnNormalSecondary"]',
    addToChartButton : '//button[@data-testid="pdpBtnNormalPrimary"]'
  }

  buyItem(){
    this.click($(this.element.buyButton))
  }
}
