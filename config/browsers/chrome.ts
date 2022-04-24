import path from 'path';

const screen = {
  x: parseInt(process.env.SCREEN_X!),
  y: parseInt(process.env.SCREEN_Y!),
  width: parseInt(process.env.SCREEN_WIDTH!),
  height: parseInt(process.env.SCREEN_HEIGHT!),
};

// https://github.com/GoogleChrome/chrome-launcher/blob/master/docs/chrome-flags-for-tools.md
const DEFAULT_ARGS = [
  // commonly unwanted browser features
  '--disable-client-side-phishing-detection',
  '--disable-component-extensions-with-background-pages',
  '--disable-default-apps',
  '--disable-extensions',
  '--mute-audio',
  '--no-default-browser-check',
  '--no-first-run',
  '--use-fake-device-for-media-stream',
  '--use-fake-ui-for-media-stream',

  // performance & web platform behavior
  '--allow-running-insecure-content',
  '--autoplay-policy=user-gesture-required',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-features=ScriptStreaming',
  '--disable-hang-monitor',
  '--disable-ipc-flooding-protection',
  '--disable-notifications',
  '--disable-popup-blocking',
  '--disable-prompt-on-repost',
  '--disable-renderer-backgrounding',

  // test & debugging flags
  '--disable-device-discovery-notifications',
  '--enable-automation',
  '--password-store=basic',
  '--silent-debugger-extension-api',
  '--test-type',
  '--use-mock-keychain',

  // background updates, networking, reporting
  '--disable-background-networking',
  '--disable-breakpad',
  '--disable-component-update',
  '--disable-domain-reliability',
  '--disable-sync',
  '--metrics-recording-only',

  // rendering & gpu
  '--deterministic-mode',
  '--disable-features=PaintHolding',
  '--disable-partial-raster',
  // Temporarily disable GPU-processing option due to known bug https://bugs.chromium.org/p/chromium/issues/detail?id=831168
  // '--in-process-gpu',

  // window & screen management
  '--block-new-web-contents',

  // process management
  '--disable-features=site-per-process',
  '--disable-dev-shm-usage',
  '--no-sandbox',

  '--user-data-dir=' +
    path.join(
      process.env.SESSION_PATH || path.join(process.cwd(), 'tmp', 'session'),
      'chrome'
    )
];

if (['true', '1'].includes(process.env.HEADLESS || '0')) {
  /* Reference:
   * > https://developers.google.com/web/updates/2017/04/headless-chrome
   * > https://www.intricatecloud.io/2019/05/running-webdriverio-tests-using-headless-chrome-inside-a-container/
   */
  DEFAULT_ARGS.push('--headless');
  DEFAULT_ARGS.push('--disable-gpu');
  DEFAULT_ARGS.push('--screenshot');
  DEFAULT_ARGS.push('--remote-debugging-port=9222');
}

if(process.env.VIEWPORT_TYPE?.includes('Desktop')) {
  // https://gs.statcounter.com/screen-resolution-stats
  DEFAULT_ARGS.push(`--window-position=${screen.x},${screen.y}`);
  DEFAULT_ARGS.push(`--window-size=${screen.width},${screen.height}`);
}

if (process.env.HTTP_PROXY) {
  DEFAULT_ARGS.push('--proxy-server=' + process.env.HTTP_PROXY);
}

if (process.env.CUSTOM_VIDEO) {
  DEFAULT_ARGS.push('--use-file-for-fake-video-capture=' + path.join(process.cwd(), process.env.CUSTOM_VIDEO));
}

const drivers = {
  chrome: process.env.DRIVER_VERSION || 'latest'
};

export const automationProtocol = 'webdriver';
export const services = [
  ['selenium-standalone', { drivers }]
];
export const capabilities = [
  {
    browserName: 'chrome',

    // https://chromedriver.chromium.org/capabilities
    'goog:chromeOptions': {
      args: DEFAULT_ARGS
    },
  },
];

if (process.env.VIEWPORT_TYPE !== 'Desktop') {
  (capabilities[0]['goog:chromeOptions'] as any)['mobileEmulation'] = {
    deviceName: process.env.VIEWPORT_TYPE
  };
}
