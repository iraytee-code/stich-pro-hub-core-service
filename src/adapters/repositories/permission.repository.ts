import { Permission } from '@modules/core/entities/permission.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionRepository extends Repository<Permission> {
  private readonly logger = new Logger(PermissionRepository.name);

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {
    super(
      permissionRepository.target,
      permissionRepository.manager,
      permissionRepository.queryRunner,
    );
  }

  async getAllPermissions(): Promise<Permission[]> {
    return await this.permissionRepository.find();
  }
}
