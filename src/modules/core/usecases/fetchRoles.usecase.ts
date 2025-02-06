import { Injectable } from '@nestjs/common';
import { RoleService } from '@modules/core/services//role.service';
import { Role } from '@modules/core/entities/role.entity';
import { Usecase } from '@broker/types';

@Injectable()
export class FetchRolesUsecase extends Usecase<{ roles: Role[] }> {
  constructor(private readonly roleService: RoleService) {
    super();
  }

  async execute(): Promise<{ roles: Role[] }> {
    const roles = await this.roleService.fetchAllRoles();
    return { roles };
  }
}
