import { Permission } from './entities/permission.entity';

import { PermissionRepository } from '@adapters/repositories/permission.repository';

import { FetchPermissionUsecase } from './usecases/fetchPermissions.usecase';

import { PermissionService } from './services/permission.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  providers: [
    // role
    // permission
    PermissionService,
    PermissionRepository,
    FetchPermissionUsecase,
  ],
  exports: [
    // role

    // permission
    PermissionService,
    PermissionRepository,
    FetchPermissionUsecase,
  ],
})
export class CoreModule {}
