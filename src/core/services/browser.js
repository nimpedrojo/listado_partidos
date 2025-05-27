// src/core/services/browser.js
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import resolveChrome from '../utils/resolveChromePath.js';

puppeteer.use(StealthPlugin());
const proxy = 'http://35.236.213.248:80';
export async function launchBrowser() {
  return puppeteer.launch({
    executablePath: resolveChrome(),   // /usr/bin/chromium en Docker
    headless: 'new',
    args: [
      '--proxy-server=' + proxy,
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-blink-features=AutomationControlled',
      '--window-size=1366,768'
    ]
  });
}
