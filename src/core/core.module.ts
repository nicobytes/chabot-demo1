import { Module, Global } from '@nestjs/common';

import { SERVICES } from './services';

@Global()
@Module({
  providers: SERVICES,
  exports: SERVICES,
})
export class CoreModule {}
