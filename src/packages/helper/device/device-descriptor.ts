export default class DeviceDescriptor {

  // Reference: https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts
  static devices = [
    {
      name: 'iPhone X',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
      viewport: {
        width: 375,
        height: 812,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        isLandscape: false
      }
    },
    {
      name: 'Pixel 2',
      userAgent: 'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
      viewport: {
        width: 411,
        height: 731,
        deviceScaleFactor: 2.625,
        isMobile: true,
        hasTouch: true,
        isLandscape: false
      }
    }
  ]

  static getDevice(deviceName = process.env.VIEWPORT_TYPE) {

    for(let i=0; i<DeviceDescriptor.devices.length; i++) {
      if(DeviceDescriptor.devices[i].name === deviceName) {
        return DeviceDescriptor.devices[i];
      }
    }

  }

}
