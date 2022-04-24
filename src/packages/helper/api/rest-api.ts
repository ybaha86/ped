import got from 'got';
import FormData from 'form-data'
import axios, {AxiosRequestConfig} from "axios";

export interface Data {
  countryCode: string,
  phoneNb: string;
  expiryDate?: string;
  updateToNumber?:string;
}

export type tRequestComponent ={
  protocol?: string,
  url? :string,
  qs? : string [],
  payload? : { [id: string]: any },
  headers?: any
}
export abstract class restAPI{
  protected baseURL:string
  protected path:string
  protected urlProtocol:string
  protected defHeaders : any
  /**
   *This is abstract class DO NOT instantiate
   *
   */
  constructor() {
    this.baseURL = 'abstract'
    this.path = 'abstract'
    this.urlProtocol = 'http://'
    this.defHeaders = {
      ['Connection']: 'close',
      ['Cache-Control']: 'no-cache',
      ['Pragma']: 'no-cache',
      ['Accept']: 'application/json'
    }
  }
  get (table: string, request: tRequestComponent) {
    browser.pause(parseInt(process.env.WAITTIME_GRACE!));
    const _head = (request.headers) ?request.headers :this.defHeaders
    const _url = (request.url) ?request.url :this.baseURL
    const _protocol = (request.protocol) ?request.protocol :this.urlProtocol
    console.log('GET :' ,_protocol + [_url, table].join('/') + (request.qs?.length ? '?' + request.qs.join('&') : ''))
    return browser.call(async () => {
      try {
        const res =  await got.get(_protocol + [_url, table].join('/') + (request.qs?.length ? '?' + request.qs.join('&') : ''), {
          headers: _head
        }).json();
        return res
      } catch (e) {
        console.log(_head);
        console.log(e) }
    });
  }

  patch (table: string, request: tRequestComponent) {
    const _head = request.headers ?request.headers :this.defHeaders
    const _url = request.url ?request.url :this.baseURL
    const _protocol = (request.protocol) ?request.protocol :this.urlProtocol
    console.log('PATCH :' ,_protocol + [_url, table].join('/') + (request.qs?.length ? '?' + request.qs.join('&') : ''))
    browser.pause(parseInt(process.env.WAITTIME_GRACE!));
    return browser.call(async () => {
      try {
        const res = await got.patch(_protocol + [_url, table].join('/') + (request.qs?.length ? '?' + request.qs.join('&') : ''), {
          json: request.payload,
          headers:_head
        }).json();
        return res
      } catch (e) {
        console.log(_head);
        console.log(e)
      }
    });
  }

  put (table: string, request: tRequestComponent) {
    const _head = request.headers ?request.headers :this.defHeaders
    const _url = request.url ?request.url :this.baseURL
    const _protocol = (request.protocol) ?request.protocol :this.urlProtocol
    console.log('PUT :',_protocol + [_url, table].join('/') + (request.qs?.length ? '?' + request.qs.join('&') : ''))
    browser.pause(parseInt(process.env.WAITTIME_GRACE!));
    return browser.call(async () => {
      try {
        const res = await got.put(_protocol + [_url, table].join('/')  + (request.qs?.length ? '?' + request.qs.join('&') : ''), {
          form: request.payload,
          headers:_head
        }).json();
        console.log('Put Result:', res)
        return res
      } catch (e) {
        console.log(_head);
        console.log(e)
      }
    });
  }
post (table: string, request: tRequestComponent) {
  const _head = request.headers ?request.headers :this.defHeaders
  const _url = request.url ?request.url :this.baseURL
  const _protocol = request.protocol ?request.protocol :this.urlProtocol
  console.log('POST :',_protocol + [_url, table].join('/') + (request.qs?.length ? '?' + request.qs.join('&') : ''))
  browser.pause(parseInt(process.env.WAITTIME_GRACE!));
  return browser.call(async () => {
    try {
      const res = await got.post(_protocol + [_url, table].join('/') + (request.qs?.length ? '?' + request.qs.join('&') : ''), {
        form: request.payload,
        headers:_head
      }).json();
      console.log('POST Result:', res)
      return res
    } catch (e) {
      console.log(_head);
      console.log(e)
    }
  });
}
postAxios (table: string, { qs, payload }: { qs?: string[], payload: FormData }){
    browser.pause(parseInt(process.env.WAITTIME_GRACE!));
    const uri = this.urlProtocol + [this.baseURL, table].join('/') + (qs?.length ? '?' + qs.join('&') : '')
    console.log('POST :', uri)
    return browser.call(async () => {
      try {
        const config:AxiosRequestConfig = {
          method: 'post',
          url: uri,
          headers: {
            'accept': 'application/json, text/plain, */*',
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryGAkgg4jK2RC9D0ZQ',
            ...payload.getHeaders()
          },
          data : payload
        };
        const promise = axios.request(config)
        const dataPromise = promise.then((response) => response.data)
        promise.catch(function (error:any) {console.log(error);
          });
        return dataPromise
        }
        catch (error) {
        console.error(error)
      }
    })
  }
}
