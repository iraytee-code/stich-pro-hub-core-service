import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import common from '@config/common.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [common],
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
