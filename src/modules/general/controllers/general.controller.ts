import {
  Controller,
  Get,
  Param,
  Query,
  Redirect,
  Render,
} from '@nestjs/common';

import { GeneralService } from '../services/general.service';

@Controller()
export class GeneralController {
  constructor(private readonly service: GeneralService) {}

  @Get()
  @Render('home')
  async root() {
    return {
      games: await this.service.homePageGames(),
    };
  }

  @Get('clear-cache')
  @Redirect('/')
  clearCache() {
    this.service.clearCache();

    return '';
  }

  @Get('/games')
  @Render('tags')
  async tags() {
    return {
      tags: await this.service.tags(),
    };
  }

  @Get('/game/:gameSlug')
  @Render('game')
  async game(@Param('gameSlug') gameSlug: string) {
    const game = await this.service.game(gameSlug);

    return {
      game,
    };
  }

  @Get(['/games/:tagSlug', '/games/:tagSlug/page/:page'])
  @Render('games')
  async games(@Param('tagSlug') tagSlug: string, @Param('page') page: string) {
    const { games, pagination } = await this.service.tag(tagSlug, page);

    return {
      games,
      tagTitle: tagSlug,
      pagination,
    };
  }

  @Get('/search')
  @Render('search')
  async search(@Query('text') text: string) {
    return {
      searchTitle: text,
      games: await this.service.search(text),
    };
  }
}
