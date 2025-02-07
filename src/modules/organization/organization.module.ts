import { Module } from '@nestjs/common';
import { Broker } from '@broker/broker';
import { CoreModule } from '@modules/core/core.module';
import { OrganizationController } from './controllers/organization.controller';
import { OrganizationRepository } from '@adapters/repositories/organization.repository';
import { OrganizationSignupUsecase } from './usecase/organizationSignup.usecase';
import { OrganizationService } from './services/organization.service';
import { HashingUtil } from '@shared/utils/hashing/hashing.utils';
import { BcryptHashingUtil } from '@shared/utils/hashing/bcrypt.utils';
import { VerifyOrganizationAccountUsecase } from './usecase/verifyOrganization.usecase';
import { Organization } from '@modules/core/entities/organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '@modules/user/user.module';
import { NotificationModule } from '@modules/notifications/notification.module';

@Module({
  imports: [CoreModule, UserModule, NotificationModule, TypeOrmModule.forFeature([Organization])],
  providers: [
    ConfigService,
    Broker,
    OrganizationService,
    OrganizationRepository,
    OrganizationController,
    OrganizationSignupUsecase,
    VerifyOrganizationAccountUsecase,
    {
      provide: HashingUtil,
      useClass: BcryptHashingUtil,
    },
  ],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
