import { Injectable } from '@nestjs/common';
import { ArcadeSpotService } from '@shared/services/arcade-spot.service';

@Injectable()
export class GeneralService {
  constructor(private readonly arcadeSpotService: ArcadeSpotService) {}

  async tags() {
    return this.arcadeSpotService.tags();
  }
}
