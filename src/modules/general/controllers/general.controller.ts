import { Controller, Get, Render } from '@nestjs/common';

import { GeneralService } from '../services/general.service';

@Controller()
export class GeneralController {
  constructor(private readonly service: GeneralService) {}

  @Get()
  @Render('home')
  async root() {
    return { data: await this.service.tags() };
  }

  @Get('/about')
  @Render('about')
  about() {
    return { title: 'About Page' };
  }
}
