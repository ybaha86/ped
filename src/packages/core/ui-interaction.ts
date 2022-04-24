import path from 'path';
import allure from '@wdio/allure-reporter';

type State = 'isExisting' | 'isDisplayed' | 'isClickable';
const monthsEN = [...Array(12).keys()].map(key => new Date(0, key).toLocaleString('en', { month: 'long' }))

function addSubStepToReporter (title: string, id?: string) {
  let screenshot!: { [id: string]: string | Buffer };

  try {
    if (id) {
      screenshot = {
        name: 'Element screenshot',
        content: Buffer.from(
          browser.takeElementScreenshot(id), 'base64'
        ), type: 'image/png'
      }
    }
  }
  catch { /** TODO: revisit this in future, for now ignore failed screenshot capture */ }

  allure.addStep(title, screenshot);
}

export abstract class UIInteraction {

  static CLICKABLE: State = 'isExisting';
  static DISPLAYED: State = 'isDisplayed';
  static EXIST: State = 'isExisting';

  expect (selector: string, message?: string) {
    const element = $(selector);
    const result = expect(element);

    addSubStepToReporter(`Expect $('${selector}') ${message}`, element.elementId);

    return result;
  }

  protected await (element: WebdriverIO.Element, {
    report = false,
    reverse = false,
    state = UIInteraction.CLICKABLE
  } = {}) {
    return browser.waitUntil(() => {
      const expectation = (reverse !== element[state]());

      if (!expectation) {
        element = $(element.selector);
      }
      else {
        if (!reverse) element.scrollIntoView({ block: 'center', inline: 'center' });

        if (report) {
          addSubStepToReporter(
            `Await $('${element.selector}') to ${!reverse ? '' : 'not'} ${state.substr(2).replace('ing', '').toLowerCase()}`,
            !reverse ? (!expectation ? undefined : element.elementId) : undefined
          );
        }
      }

      return expectation;
    });
  }

  protected click (element: WebdriverIO.Element, {
    double = false,
    report = true,
    avoidLinkText = true
  } = {}) {
    this.await(element);

    avoidLinkText ? element.click({ x: 5, y: 5}) : element.click();  // prevent clicking on linked text in the center of the element

    if (double) {
      element.click({ x: 5, y: 5}); // prevent clicking on linked text in the center of the element
    }
    if (report) {
      addSubStepToReporter(
        `${!double ? 'C' : 'Double c'}lick $('${element.selector}')`,
        element.elementId
      );
    }
  }

  protected pickDate(element : WebdriverIO.Element, text: string,{
    yearPickerLocator='',
    monthLabelLocator='',
    prevMonthBtnLocator='',
    nextMonthBtnLocator='',
    dayPickerLocator='',
  } = {}){
    this.click(element, { report: false });
    browser.pause(500);

    const curUI = monthsEN.indexOf($(monthLabelLocator).getText())+1
    const dd = text.split('/')[0]
    const mm = parseInt(text.split('/')[1])
    const yyyy = text.split('/')[2]
    let mmAdjust = curUI-mm

    if (mmAdjust>0) {
      while(mmAdjust>0){
        mmAdjust-=1
        this.click($(prevMonthBtnLocator),{ report: false });browser.pause(250);
      }
    } else if(mmAdjust<0){
      while(mmAdjust<0){
        mmAdjust+=1
        this.click($(nextMonthBtnLocator),{ report: false });browser.pause(250);
      }
    }
    this.enter($(yearPickerLocator),yyyy);
    dayPickerLocator= dayPickerLocator+'['+dd+']'
    this.click($(dayPickerLocator), { report: false })
    addSubStepToReporter(
      `Selected date "${text}" from $('${element.selector}')`, element.elementId
    );
  }

  protected enter (element: WebdriverIO.Element, text: string, {
    mask = false,
    clear = true,
    enter = false,
    paste = false
  } = {}) {
    this.click(element, { report: false });

    if (clear) {
      element.clearValue();
      this.click(element, { report: false }); // element lost focus in selenium, re-focus on the element
    }

    !paste ? browser.keys(text) : element.setValue(text);

    if (enter) {
      browser.keys('Enter');
    }

    addSubStepToReporter(
      `${!paste ? 'Type' : 'Paste'} "${!mask ? text : '*****'}" in $('${element.selector}')`,
      element.elementId
    );
  }

  protected select (element: WebdriverIO.Element, text: string, {
    enter = false,
    selector = false
} = {}) {
  this.click(element, { report: false, avoidLinkText:false });

  !selector ? browser.keys(text) : this.click($(text), { report: false });

  if (enter) {
    browser.keys('Enter');
  }

  addSubStepToReporter(
    `Select "${text}" from $('${element.selector}')`,
    element.elementId
  );
}
protected getSelectOptions(opt:string) : string {
  return `//*[text()[contains(.,"${opt}")]]`
}
  protected dynamicSelect(element:WebdriverIO.Element, itemsSelector:string, text:string){
    this.click(element, { report: false });
    browser.pause(1000);
    browser.keys(text)
    const items=$$(itemsSelector);
    console.log("iniItem:"+ items)
    items.forEach(item =>{
      // if (item.getText().includes(text)) {
        this.click(item, { report: true });
        browser.pause(500);
      // }
    })
    addSubStepToReporter(
      `Dynamic Select "${text}" from $('${element.selector}')`,
      element.elementId
    );
  }

  protected upload (element: WebdriverIO.Element, document: string) {
    this.await(element, { state: UIInteraction.EXIST });

    // The WebDriver spec defines input elements to be interactable in order to change their value
    // https://w3c.github.io/webdriver/#interactability
    // https://w3c.github.io/webdriver/#element-send-keys
    browser.execute((el) => {
      el.classList.remove('hidden');
      el.style = 'display: block !important; opacity: 100% !important';
    }, $(element.selector));

    $(element.selector).addValue(
      browser.uploadFile(path.join(process.cwd(), 'fixtures', document))
    );

    addSubStepToReporter(`Upload "${document}" using $('${element.selector}')`);
  }

}
