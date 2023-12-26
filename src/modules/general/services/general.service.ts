import { Injectable } from '@nestjs/common';
import { ArcadeSpotService } from '@shared/services/arcade-spot.service';

@Injectable()
export class GeneralService {
  tagTranslate = {
    Action: 'اکشن',
    Adventure: 'ماجراجویی',
    Arcade: 'آرکید',
    Multiplayer: 'چند نفره',
    Mobile: 'موبایل',
    Puzzle: 'پازل',
    Racing: 'مسابقه‌ای',
    Shooting: 'تیراندازی',
    Sports: 'ورزشی',
    Strategy: 'استراتژی',
  };

  constructor(private readonly arcadeSpotService: ArcadeSpotService) {}

  async tags() {
    return this.arcadeSpotService.tags();
  }

  async tag(tagSlug: string, page?: string) {
    if (!Number(page) || Number(page) <= 1) {
      page = void 0;
    }

    return this.arcadeSpotService.tag(tagSlug, page);
  }

  async game(gameSlug: string) {
    return this.arcadeSpotService.game(gameSlug);
  }

  async search(text: string) {
    return this.arcadeSpotService.search(text);
  }

  async homePageGames() {
    return this.arcadeSpotService.homePageGames();
  }

  async headerTags() {
    const tags = await this.arcadeSpotService.headerTags();

    for (const tag of tags) {
      if (Object.keys(this.tagTranslate).includes(tag.name)) {
        tag.name = this.tagTranslate[tag.name];
      }
    }

    return tags;
  }

  clearCache() {
    return this.arcadeSpotService.clearCache();
  }
}
