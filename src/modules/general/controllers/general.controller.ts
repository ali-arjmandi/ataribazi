import {
  Controller,
  Get,
  Param,
  Query,
  Redirect,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { GeneralService } from '../services/general.service';

@Controller()
export class GeneralController {
  constructor(private readonly service: GeneralService) {}

  @Get()
  @Render('home')
  async root() {
    return {
      games: await this.service.homePageGames(),
      headerTags: await this.service.headerTags(),
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
      headerTags: await this.service.headerTags(),
    };
  }

  @Get('/game/:gameSlug')
  @Render('game')
  async game(@Param('gameSlug') gameSlug: string) {
    const game = await this.service.game(gameSlug);

    return {
      game,
      headerTags: await this.service.headerTags(),
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
      headerTags: await this.service.headerTags(),
    };
  }

  @Get('/search')
  @Render('search')
  async search(@Query('text') text: string, @Res() res: Response) {
    if (!text) {
      res.redirect('/');
    }

    return {
      searchTitle: text,
      games: await this.service.search(text),
      headerTags: await this.service.headerTags(),
    };
  }
}
