import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configSchema from '@config/schema.config';
import common from '@config/common.config';
import typeorm from '@config/typeorm.config';
import { Broker } from '@broker/broker';
import { UtilsModule } from '@modules/utils/util.module';
// import { AuthModule } from '@modules/auth/auth.module';
// import { JwtAuthGuard } from '@modules/auth/guards/jwtAuth.guard';
import { APP_GUARD } from '@nestjs/core';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [common, typeorm],
      ...configSchema,
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.get('typeorm'),
    }),
    UtilsModule,
    ThrottlerModule.forRoot([{ ttl: 30000, limit: 10 }]),
  ],
  controllers: [],
  providers: [
    Broker,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [Broker],
})
export class AppModule {}
