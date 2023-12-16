import { Injectable } from '@nestjs/common';
import { HomePageGameDto } from '@shared/dto/home-page-game.dto';
import { TagDto } from '@shared/dto/tag.dto';
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

  async tags(): Promise<TagDto[]> {
    const html = await this.getHtml(`${this.url}/games`);
    const $ = cheerio.load(html);
    const data = $('.as-tags-list')[0].cloneNode(true).childNodes;

    return data.map((li: any) => {
      const url = li.children[0].attribs.href.split(this.url)[1];
      const item = li.children[0].children;

      return {
        image: item[0].attribs.src,
        name: item[1].data,
        url,
      };
    });
  }

  async homePageGames(): Promise<HomePageGameDto[]> {
    const html = await this.getHtml(`${this.url}`);
    const $ = cheerio.load(html);
    const data = $('.as-game-list')[0].cloneNode(true).childNodes;
    const result = [];

    for (const li of data) {
      let item = (li as any).children[0];

      if (item.children.length !== 3) {
        continue;
      }

      const url = item.attribs.href.split(this.url)[1];

      item = item.children;

      result.push({
        image: item[0].attribs['data-src'],
        name: item[1].children[0].data,
        tag: item[2].children[0].data,
        url,
      });
    }

    return result;
  }
}
