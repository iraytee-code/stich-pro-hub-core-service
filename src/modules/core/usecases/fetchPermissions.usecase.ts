import { Usecase } from '@broker/types';
import { Injectable } from '@nestjs/common';
import { PermissionService } from '@modules/core/services/permission.service';
import { Permission } from '@modules/core/entities/permission.entity';

@Injectable()
export class FetchPermissionUsecase extends Usecase<{ permission: Permission }> {
  constructor(private readonly permissionService: PermissionService) {
    super();
  }
  async execute(): Promise<{ permission: Permission }> {
    const permissions = await this.permissionService.fetchAllpermissions();
    return { permission: permissions[0] };
  }
}
