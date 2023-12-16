import { Controller, Get, Render } from '@nestjs/common';

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

  @Get('/games')
  @Render('tags')
  async tags() {
    return {
      tags: await this.service.tags(),
    };
  }
}
