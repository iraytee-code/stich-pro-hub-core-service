import { PermissionRepository } from '@adapters/repositories/permission.repository';
import { Permission } from '../entities/permission.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PermissionService {
  private logger = new Logger(PermissionService.name);
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async fetchAllpermissions(): Promise<Permission[]> {
    return this.permissionRepository.getAllPermissions();
  }
}
