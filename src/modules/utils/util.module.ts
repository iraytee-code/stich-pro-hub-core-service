import { Module } from '@nestjs/common';
import { Broker } from '@broker/broker';
import { CoreModule } from '@modules/core/core.module';
import { UtilsController } from './controllers/utils.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [CoreModule],
  providers: [Broker],
  controllers: [UtilsController],
  exports: [],
})
export class UtilsModule {}
