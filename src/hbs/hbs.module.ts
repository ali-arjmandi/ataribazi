// hbs.module.ts
import { Module } from '@nestjs/common';

import { HbsRenderer } from './hbs.renderer';

@Module({
  providers: [HbsRenderer],
})
export class HbsModule {}
