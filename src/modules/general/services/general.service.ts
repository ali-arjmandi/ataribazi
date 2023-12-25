import { Injectable } from '@nestjs/common';
import { ArcadeSpotService } from '@shared/services/arcade-spot.service';

@Injectable()
export class GeneralService {
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

  async homePageGames() {
    return this.arcadeSpotService.homePageGames();
  }

  clearCache() {
    return this.arcadeSpotService.clearCache();
  }
}
