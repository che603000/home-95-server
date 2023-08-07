import { Global, Module } from '@nestjs/common';
import { RainService } from './rain.service';

@Global()
@Module({
  providers: [RainService],
  exports: [RainService],
})
export class RainModule {}
