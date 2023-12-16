import { Module } from '@nestjs/common';

import { ArcadeSpotService } from './services/arcade-spot.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ArcadeSpotService],
  exports: [ArcadeSpotService],
})
export class SharedModule {}
