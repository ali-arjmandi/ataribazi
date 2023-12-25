import { GeneralModule } from '@modules/general/general.module';
import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';
import { HbsModule } from 'hbs/hbs.module';

@Module({
  imports: [GeneralModule, SharedModule, HbsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
