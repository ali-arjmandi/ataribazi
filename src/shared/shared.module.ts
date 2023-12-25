import { Module } from '@nestjs/common';

import { ArcadeSpotService } from './services/arcade-spot.service';
import { BrowserManager } from './services/browser-manager.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ArcadeSpotService, BrowserManager],
  exports: [ArcadeSpotService],
})
export class SharedModule {}
