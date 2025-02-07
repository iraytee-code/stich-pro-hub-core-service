import { RoleRepository } from '@adapters/repositories/role.repository';
import { Role } from '../entities/role.entity';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RoleService {
  private logger = new Logger(RoleService.name);
  constructor(private readonly roleRepository: RoleRepository) {}

  async fetchAllRoles(): Promise<Role[]> {
    return this.roleRepository.getAllRoles();
  }
}
