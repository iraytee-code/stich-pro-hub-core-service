import { Role } from '@modules/core/entities/role.entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleRepository extends Repository<Role> {
  private readonly logger = new Logger(RoleRepository.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    super(roleRepository.target, roleRepository.manager, roleRepository.queryRunner);
  }

  async getAllRoles(): Promise<Role[]> {
    return await this.roleRepository.find();
  }
}
