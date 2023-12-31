import { Injectable } from '@nestjs/common';
import { HomePageGameDto } from '@shared/dto/home-page-game.dto';
import { PaginationDto } from '@shared/dto/pagination.dto';
import { TagDto } from '@shared/dto/tag.dto';
import * as cheerio from 'cheerio';

import { BrowserManager } from './browser-manager.service';

@Injectable()
export class ArcadeSpotService {
  url = 'https://arcadespot.com';

  constructor(private readonly browserManager: BrowserManager) {}

  async tags(): Promise<TagDto[]> {
    const html = await this.browserManager.getHtml(`${this.url}/games`);
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

  async tag(
    tagSlug: string,
    page?: string,
  ): Promise<{ games: TagDto[]; pagination: PaginationDto }> {
    const html = await this.browserManager.getHtml(
      `${this.url}/games/${tagSlug}${page ? '/page/' + page : ''}`,
    );
    const $ = cheerio.load(html);
    const gameData = $('.as-game-list')[0].cloneNode(true).childNodes;

    const games = gameData
      .map((li: any) => {
        const url = li.children[0].attribs?.href?.split(this.url)[1];

        if (!url) {
          return;
        }

        const item = li.children[0].children;

        return {
          image: item[0].attribs['data-src'],
          name: item[1].firstChild.data,
          url,
        };
      })
      .filter((item) => Boolean(item));

    const paginationData = $('.pagination')[0];
    const activeChildren: any = $(paginationData).find('.active');
    const currentPage = activeChildren[0]?.firstChild?.firstChild?.data;
    const nextElementAfterActive = activeChildren.next();
    const hasNext =
      nextElementAfterActive.length > 0 &&
      nextElementAfterActive[0].firstChild.name === 'a';
    const nextPageUrl = hasNext
      ? nextElementAfterActive[0].firstChild.attribs.href.split(this.url)[1]
      : null;
    const prevElementAfterActive = activeChildren.prev();
    const hasPrev =
      prevElementAfterActive.length > 0 &&
      prevElementAfterActive[0].firstChild.name === 'a';
    const prevPageUrl = hasPrev
      ? prevElementAfterActive[0].firstChild.attribs.href.split(this.url)[1]
      : null;

    const pagination: PaginationDto = {
      currentPage,
      nextPageUrl,
      prevPageUrl,
    };

    return { games, pagination };
  }

  async game(gameSlug: string) {
    const html = await this.browserManager.getWithGameIframe(
      `${this.url}/game/${gameSlug}`,
    );
    const $: any = cheerio.load(html);
    const title = $('.as-main-title')[0].firstChild.data;
    const image = $('.as-info-box-img')[0].firstChild.attribs.src;
    const tags = $('[aria-label="Game Tags"]')[0].children.map((item) => ({
      url: item.attribs.href.split(this.url)[1],
      name: item.firstChild.data,
    }));

    const similarGames = [];

    for (const item of $('.game-wrapper')[0].children.slice(1)) {
      for (const game of item.firstChild.children) {
        similarGames.push({
          url: game.attribs.href.split(this.url)[1],
          image: game.children[0].firstChild.attribs['data-src'],
          name: game.children[1].firstChild.data,
        });
      }
    }

    const iframeUrl = $('#game-box-iframe')[0].attribs.src;
    const width = Number(
      $('#game-box-iframe')[0].attribs.style.match(/width:\s*(\d+)/)[1],
    );
    const height = Number(
      $('#game-box-iframe')[0].attribs.style.match(/height:\s*(\d+)/)[1],
    );

    const ratio = `${width} / ${height}`;

    return {
      title,
      image,
      tags,
      similarGames,
      iframe: { url: iframeUrl, ratio },
    };
  }

  async search(text: string): Promise<TagDto[]> {
    const html = await this.browserManager.getHtml(
      `${this.url}/search/?term=${text}`,
      true,
    );
    const $ = cheerio.load(html);
    const gameData = $('.as-game-list')[0].cloneNode(true).childNodes;

    return gameData
      .map((li: any) => {
        const url = li.children[0].attribs?.href?.split(this.url)[1];

        if (!url) {
          return;
        }

        const item = li.firstChild.children;

        return {
          image: item[0].attribs['data-src'],
          name: item[1].firstChild.data,
          url,
        };
      })
      .filter((item) => Boolean(item));
  }

  async homePageGames(): Promise<HomePageGameDto[]> {
    const html = await this.browserManager.getHtml(`${this.url}`);
    const $: any = cheerio.load(html);
    const data = $('.as-game-list')[0].children;
    const result = [];

    for (const li of data) {
      let item = li.children[0];

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

  async headerTags(): Promise<TagDto[]> {
    const html = await this.browserManager.getHtml(`${this.url}`);
    const $: any = cheerio.load(html);

    return $('.main-nav')[0]
      .children.slice(1, -4)
      .map((item) => ({
        name: item.firstChild.firstChild.firstChild.data,
        url: item.firstChild.attribs.href.split(this.url)[1],
      }));
  }

  clearCache() {
    return this.browserManager.clearCache();
  }
}
