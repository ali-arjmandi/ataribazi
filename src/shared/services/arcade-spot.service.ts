import { Injectable } from '@nestjs/common';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer-extra';
import pluginStealth from 'puppeteer-extra-plugin-stealth';

@Injectable()
export class ArcadeSpotService {
  url = 'https://arcadespot.com';

  async getHtml(url: string) {
    puppeteer.use(pluginStealth());

    return puppeteer.launch({ headless: 'new' }).then(async (browser) => {
      const page = await browser.newPage();
      await page.goto(url);
      const html = await page.content();
      await browser.close();

      return html;
    });
  }

  async tags(): Promise<Array<{ name: string; image: string }>> {
    const html = await this.getHtml(`${this.url}/games`);
    const $ = cheerio.load(html);
    const data = $('.as-tags-list')[0].cloneNode(true).childNodes;

    return data.map((li: any) => {
      const item = li.children[0].children;

      return {
        name: item[1].data,
        image: item[0].attribs.src,
      };
    });
  }
}
