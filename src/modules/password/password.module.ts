import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from '@modules/core/core.module';
import { UserModule } from '@modules/user/user.module';
import { NotificationModule } from '@modules/notifications/notification.module';
import { PasswordResetController } from './controller/password.controller';
import { PasswordResetService } from './services/password-reset.services';
import { OtpService } from '@modules/core/services/otp.service';
import { RandomnessUtil } from '@shared/utils/encryption/randomness.util';
import { Organization } from '@modules/core/entities/organization.entity';
import { OrganizationRepository } from '@adapters/repositories/organization.repository';

@Module({
  imports: [CoreModule, UserModule, NotificationModule, TypeOrmModule.forFeature([Organization])],
  providers: [PasswordResetService, OtpService, RandomnessUtil, OrganizationRepository],
  controllers: [PasswordResetController],
  exports: [PasswordResetService],
})
export class PasswordModule {}
