import { IWorldOptions, World } from '@cucumber/cucumber';
import Manager from './manager';

import * as tokped from './tokped';
export { tokped }

export class Core extends World {

  data = new Map();
  static continous_test_data = new Map()
  #manager = Manager;

  constructor (options: IWorldOptions) {
    super(options);
    if (this.isContinuousScenario()){
      this.data= this.getDataMap()
    }
  }
  getDataMap(){
    //for continuous scenario we bring all the data
    if (this.isContinuousScenario()){
      if (this.data.size > Core.continous_test_data.size){
        for (const _key of this.data.keys()){
          Core.continous_test_data.set(_key, this.data.get(_key))}
      }else{
        for (const _key of Core.continous_test_data.keys()){
          this.data.set(_key, Core.continous_test_data.get(_key))}
      }
    }
    return (this.data === undefined || !this.isContinuousScenario()) ? new Map() : this.data
  }
  reset ({ reload = true } = {}) {

    this.clearApplicationStorage();
    if (reload) browser.reloadSession();
    this.data = this.getDataMap();
    this.#manager.reset();
  }

  getContext <T>(context?: unknown): T {
    if (context !== tokped.Context) {
      if (this.#manager.getContext() instanceof tokped.Context) {
        this.clearApplicationStorage();
      }
    }
    return this.#manager.getContext(context) as T;
  }

  getUI <T>(ui?: unknown): T {
    return this.#manager.getUI(ui) as T;
  }
  public isInterceptAPIEnable():boolean{
    if (process.env.INTERCEPTOR && !['0', 'false'].includes(process.env.INTERCEPTOR)) {
      return true
    }
    return false
  }
  private isContinuousScenario ():boolean{
    return process.env.ISCOUNTINUOSSCENARIO !== undefined && process.env.ISCOUNTINUOSSCENARIO == 'TRUE'
  }

  private clearApplicationStorage () {
    if (!this.isContinuousScenario()){
      browser.deleteAllCookies();

      browser.execute(() => {
        localStorage.clear();
        sessionStorage.clear();
      });
    }
  }

}
