import { OnModuleInit } from '@nestjs/common';
import fs from 'fs';
import { Browser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import pluginStealth from 'puppeteer-extra-plugin-stealth';

export class BrowserManager implements OnModuleInit {
  private static instance: Browser;

  private cache: Map<
    string,
    { html: string; timestamp: number; timeout: number }
  > = new Map();

  private cacheFile = 'cache.json';

  private longCacheTimeout = 5 * 24 * 60 * 60 * 1000; // 5 days

  private shortCacheTimeout = 1 * 24 * 60 * 60 * 1000; // 1 day

  async onModuleInit() {
    if (!BrowserManager.instance) {
      puppeteer.use(pluginStealth());
      BrowserManager.instance = await puppeteer.launch({
        headless: 'new',
        defaultViewport: {
          height: 300,
          width: 400,
        },
      });
      this.loadCacheFromFile();
    }
  }

  private loadCacheFromFile() {
    try {
      const data = fs.readFileSync(this.cacheFile, 'utf-8');
      this.cache = new Map(
        JSON.parse(data) as Map<
          string,
          { html: string; timestamp: number; timeout: number }
        >,
      );
    } catch {
      this.cache = new Map();
    }
  }

  private saveCacheToFile() {
    const data = JSON.stringify([...this.cache.entries()]);
    fs.writeFileSync(this.cacheFile, data, 'utf-8');
  }

  private getBrowser(): Browser {
    if (!BrowserManager.instance) {
      throw new Error('Browser not initialized');
    }

    return BrowserManager.instance;
  }

  clearCache() {
    this.cache = new Map();
    this.saveCacheToFile();
  }

  async getHtml(url: string, hasShortCache = false) {
    if (this.cache.has(url)) {
      const cachedPage = this.cache.get(url);

      if (
        !cachedPage.timeout ||
        Date.now() - cachedPage.timestamp <= cachedPage.timeout
      ) {
        return cachedPage.html;
      }

      this.cache.delete(url);
    }

    const browser = this.getBrowser();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const html = await page.content();
    await page.close();

    this.cache.set(url, {
      html,
      timestamp: Date.now(),
      timeout: hasShortCache ? this.shortCacheTimeout : this.longCacheTimeout,
    });
    this.saveCacheToFile();

    return html;
  }

  async getWithGameIframe(url: string, hasShortCache = false) {
    if (this.cache.has(url)) {
      const cachedPage = this.cache.get(url);

      if (
        !cachedPage.timeout ||
        Date.now() - cachedPage.timestamp <= cachedPage.timeout
      ) {
        return cachedPage.html;
      }

      this.cache.delete(url);
    }

    const browser = this.getBrowser();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.click('#as-play-btn');
    await page.waitForSelector('#game-box-iframe');
    const html = await page.content();
    await page.close();
    this.cache.set(url, {
      html,
      timestamp: Date.now(),
      timeout: hasShortCache ? this.shortCacheTimeout : this.longCacheTimeout,
    });
    this.saveCacheToFile();

    return html;
  }
}
