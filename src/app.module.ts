import { GeneralModule } from '@modules/general/general.module';
import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [GeneralModule, SharedModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
