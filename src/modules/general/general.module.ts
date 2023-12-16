import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';

import { GeneralController } from './controllers/general.controller';
import { GeneralService } from './services/general.service';

@Module({
  imports: [SharedModule],
  controllers: [GeneralController],
  providers: [GeneralService],
})
export class GeneralModule {}
