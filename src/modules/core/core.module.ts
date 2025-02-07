import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationModule } from '@modules/notifications/notification.module';
import { ConfigService } from '@nestjs/config';

// Entities
import { Permission } from './entities/permission.entity';
import { Role } from './entities/role.entity';
import { OtpCode } from './entities/otp.entity';

// Repositories
import { PermissionRepository } from '@adapters/repositories/permission.repository';
import { RoleRepository } from '@adapters/repositories/role.repository';
import { OtpCodeRepository } from '@adapters/repositories/otp.repository';

// Use Cases
import { FetchPermissionUsecase } from './usecases/fetchPermissions.usecase';
import { FetchRolesUsecase } from './usecases/fetchRoles.usecase';

// Services
import { PermissionService } from './services/permission.service';
import { RoleService } from './services/role.service';
import { OtpService } from './services/otp.service';

// Utils
import { RandomnessUtil } from '@shared/utils/encryption/randomness.util';
import { HashingUtil } from '@shared/utils/hashing/hashing.utils';
import { BcryptHashingUtil } from '@shared/utils/hashing/bcrypt.utils';

@Module({
  imports: [NotificationModule, TypeOrmModule.forFeature([Permission, Role, OtpCode])],
  providers: [
    ConfigService,
    // Auth Utils
    RandomnessUtil,
    {
      provide: HashingUtil,
      useClass: BcryptHashingUtil,
    },
    BcryptHashingUtil,

    // Role Management
    RoleService,
    RoleRepository,
    FetchRolesUsecase,

    // Permission Management
    PermissionService,
    PermissionRepository,
    FetchPermissionUsecase,

    // OTP Management
    OtpService,
    OtpCodeRepository,
  ],
  exports: [
    // Auth Utils
    RandomnessUtil,
    HashingUtil,

    // Role Management
    RoleService,
    RoleRepository,
    FetchRolesUsecase,

    // Permission Management
    PermissionService,
    PermissionRepository,
    FetchPermissionUsecase,

    // OTP Management
    OtpService,
    OtpCodeRepository,
  ],
})
export class CoreModule {}
