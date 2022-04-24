import * as QA from '@qa/core';
import { defineStep } from '@cucumber/cucumber';
import { chance } from '@qa/helper';


defineStep('User Login with credential {string} {string} {string}', function(this: QA.Core, username:string, password:string , secret:string){
  let ctx = this.getContext<QA.tokped.Context>(QA.tokped.Context)
  const email= (username) ?username :process.env.toped_email
  const pass= (password) ?password : process.env.toped_password
  const googleSecret = (secret) ?secret : process.env.toped_secret
  browser.navigateTo(ctx.url+'/login');

  this.getUI<QA.tokped.loginPage>(QA.tokped.loginPage)
    .submitLogin(email, pass, googleSecret)
});

defineStep('Search Product {string}', function(this:QA.Core, product:string){
  this.getContext<QA.tokped.Context>(QA.tokped.Context)

  const _product = (product) ? product :'Macbook Pro 2020';
  this.getUI<QA.tokped.BaseUI>(QA.tokped.BaseUI)
    .searchProduct(_product)
    // .selectDelivery()
    .closeInfoBanner()
});

/**
 * 1 : Paling Sesuai
 * 2 : Ulasan
 * 3 : Terbaru
 * 4 : Harga Tertinggi
 * 5 : Harga Terendah
 */
defineStep('Short search result based on {string}',function(this:QA.Core, shortOptions:string){
  const options = ["Paling Sesuai","Ulasan","Terbaru","Harga Tertinggi","Harga Terendah"]
  this.getContext<QA.tokped.Context>(QA.tokped.Context)
  this.getUI<QA.tokped.searchResultPage>(QA.tokped.searchResultPage)
    .shortSearchResultBasedOnOptions(options[parseInt(shortOptions) -1])
})

defineStep('select item by index {string}', function(this:QA.Core, index:string){
  this.getContext<QA.tokped.Context>(QA.tokped.Context)
  this.getUI<QA.tokped.searchResultPage>(QA.tokped.searchResultPage)
    .selectItemByIndex(parseInt(index))
});

defineStep('Purchase selected item', function(this:QA.Core){
  this.getContext<QA.tokped.Context>(QA.tokped.Context)
  this.getUI<QA.tokped.itemDetailsPage>(QA.tokped.itemDetailsPage)
    .buyItem()
})
