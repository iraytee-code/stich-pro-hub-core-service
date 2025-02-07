import { Module } from '@nestjs/common';
import { Broker } from '@broker/broker';
import { CoreModule } from '@modules/core/core.module';
import { HashingUtil } from '@shared/utils/hashing/hashing.utils';
import { BcryptHashingUtil } from '@shared/utils/hashing/bcrypt.utils';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '@modules/core/entities/user.entity';
import { UserService } from './services/user.service';
import { UserRepository } from '@adapters/repositories/user.repository';

@Module({
  imports: [CoreModule, TypeOrmModule.forFeature([User])],
  providers: [
    ConfigService,
    UserService,
    UserRepository,
    Broker,
    {
      provide: HashingUtil,
      useClass: BcryptHashingUtil,
    },
    BcryptHashingUtil,
  ],
  controllers: [],
  exports: [UserService, UserRepository, TypeOrmModule],
})
export class UserModule {}
